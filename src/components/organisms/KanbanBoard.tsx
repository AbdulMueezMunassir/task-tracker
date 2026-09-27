"use client";

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/molecules/TaskCard";
import { TaskFormModal } from "@/components/organisms/TaskFormModal";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/api/tasks";
import type { Task } from "@prisma/client";

const columns: { key: Task["status"]; label: string; color: string }[] = [
  { key: "TODO", label: "To Do", color: "bg-slate-400" },
  { key: "IN_PROGRESS", label: "In Progress", color: "bg-blue-600" },
  { key: "DONE", label: "Done", color: "bg-emerald-500" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Search state with debounce
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "TODO" | "IN_PROGRESS" | "DONE";
    dueDate: string | null;
  }) {
    if (editingTask) {
      const updated = await updateTask(editingTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } else {
      const created = await createTask(data);
      setTasks((prev) => [created, ...prev]);
    }
    setEditingTask(null);
  }

  async function handleDelete(task: Task) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    await deleteTask(task.id);
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
  }

  async function handleStatusChange(task: Task, status: Task["status"]) {
    const updated = await updateTask(task.id, { status });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function handleNewTask() {
    setEditingTask(null);
    setModalOpen(true);
  }

  // Filter tasks by search query
  const filteredTasks = tasks.filter((task) => {
    const q = debouncedQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      task.title.toLowerCase().includes(q) ||
      (task.description?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <>
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Task Board</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your tasks across the workflow.
          </p>
        </div>

        {/* Search + Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-3 w-full md:w-56 text-sm bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button onClick={handleNewTask} className="gap-1.5 shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              className="flex flex-col bg-white/70 backdrop-blur-md rounded-xl border border-slate-200/70 p-3 min-h-[400px]"
            >
              <div className="flex items-center justify-between pb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h2 className="text-sm font-semibold">{col.label}</h2>
                  <span className="h-5 px-1.5 rounded-full bg-white/80 text-xs border border-slate-200/70 flex items-center font-semibold text-slate-600">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={handleNewTask}
                  className="w-7 h-7 rounded-md hover:bg-white/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                  aria-label="Add task"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {colTasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    {debouncedQuery ? "No matching tasks" : "No tasks"}
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleSubmit}
      />
    </>
  );
}