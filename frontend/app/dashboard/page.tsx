"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

interface Todo {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
}

const API = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Get auth token from Supabase session
  const getToken = async (): Promise<string> => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? "";
  };

  // Fetch all todos from Go API
  const fetchTodos = async () => {
    const token = await getToken();
    if (!token) throw new Error("401");
    const res = await fetch(`${API}/api/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) throw new Error("401");
    if (!res.ok) throw new Error("Failed to fetch todos");
    return res.json() as Promise<Todo[]>;
  };

  // On mount: check session, load todos
  useEffect(() => {
    // Initial load — check if we have a session right now
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/");
        return;
      }
      setUserEmail(session.user.email ?? "");
      setLoading(true);
      fetchTodos()
        .then(setTodos)
        .catch((err) => {
          if (err.message === "401") {
            setError("Failed to load todos (401 Unauthorized — check backend JWT config)");
          } else {
            setError("Failed to load todos");
          }
        })
        .finally(() => setLoading(false));
    });

    // Also listen for sign-out events so logout works correctly
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAdd = async (title: string) => {
    const token = await getToken();
    const res = await fetch(`${API}/api/todos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) { setError("Failed to add todo"); return; }
    const newTodo = await res.json() as Todo;
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggle = async (id: number) => {
    const token = await getToken();
    const res = await fetch(`${API}/api/todos/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { setError("Failed to update todo"); return; }
    const updated = await res.json() as Todo;
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleDelete = async (id: number) => {
    const token = await getToken();
    const res = await fetch(`${API}/api/todos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) { setError("Failed to delete todo"); return; }
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: "40px 16px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111", margin: 0 }}>My Todos</h1>
            {userEmail && (
              <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>{userEmail}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "none",
              border: "1.5px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              color: "#555",
            }}
          >
            Logout
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fff0f0", color: "#c00", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {/* Add todo */}
        <AddTodo onAdd={handleAdd} />

        {/* Todo list */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#aaa" }}>Loading...</p>
        ) : (
          <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
        )}

        {/* Count */}
        {!loading && todos.length > 0 && (
          <p style={{ textAlign: "center", color: "#bbb", fontSize: "13px", marginTop: "20px" }}>
            {todos.filter((t) => t.done).length} of {todos.length} completed
          </p>
        )}
      </div>
    </div>
  );
}
