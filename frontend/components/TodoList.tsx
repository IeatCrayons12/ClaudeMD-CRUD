"use client";

import TodoItem from "./TodoItem";

interface Todo {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#aaa", fontSize: "15px", padding: "32px 0" }}>
        No todos yet. Add one above!
      </p>
    );
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}
