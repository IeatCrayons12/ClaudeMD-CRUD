"use client";

import { useState } from "react";

interface AddTodoProps {
  onAdd: (title: string) => Promise<void>;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await onAdd(title.trim());
    setTitle("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new todo..."
        disabled={loading}
        style={{
          flex: 1,
          padding: "10px 14px",
          fontSize: "15px",
          border: "1.5px solid #ddd",
          borderRadius: "8px",
          outline: "none",
          background: "#fff",
        }}
      />
      <button
        type="submit"
        disabled={loading || !title.trim()}
        style={{
          padding: "10px 20px",
          background: loading || !title.trim() ? "#ccc" : "#111",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "15px",
          fontWeight: "500",
          cursor: loading || !title.trim() ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
