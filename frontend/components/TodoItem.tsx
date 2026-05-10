"use client";

interface Todo {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        background: "#fff",
        borderRadius: "8px",
        marginBottom: "8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      {/* Toggle checkbox */}
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#111" }}
      />

      {/* Title */}
      <span
        style={{
          flex: 1,
          fontSize: "15px",
          color: todo.done ? "#aaa" : "#111",
          textDecoration: todo.done ? "line-through" : "none",
        }}
      >
        {todo.title}
      </span>

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          background: "none",
          border: "none",
          color: "#ccc",
          fontSize: "18px",
          cursor: "pointer",
          lineHeight: 1,
          padding: "0 4px",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#e00")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#ccc")}
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}
