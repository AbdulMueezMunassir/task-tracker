"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@prisma/client";

type TaskFormModalProps = {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onSubmit: (data: {
    title: string;
    description: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "TODO" | "IN_PROGRESS" | "DONE";
    dueDate: string | null;
  }) => Promise<void>;
};

export function TaskFormModal({
  open,
  onClose,
  task,
  onSubmit,
}: TaskFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "DONE">("TODO");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setPriority(task?.priority ?? "MEDIUM");
      setStatus(task?.status ?? "TODO");
      setDueDate(
        task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      );
      setError("");
    }
  }, [open, task]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    // Client-side past-date check (mirrors Zod validation)
    if (dueDate) {
      const selected = new Date(dueDate);
      const today = new Date(new Date().toDateString());
      if (selected < today) {
        setError("Due date cannot be in the past");
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Today's date in YYYY-MM-DD for the `min` attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="focus-visible:ring-blue-500 focus-visible:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="focus-visible:ring-blue-500 focus-visible:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority — Custom Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(v) =>
                  setPriority(v as "LOW" | "MEDIUM" | "HIGH")
                }
              >
                <SelectTrigger
                  id="priority"
                  className="w-full h-9 bg-background border-border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem
                    value="LOW"
                    className="focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 cursor-pointer"
                  >
                    Low
                  </SelectItem>
                  <SelectItem
                    value="MEDIUM"
                    className="focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 cursor-pointer"
                  >
                    Medium
                  </SelectItem>
                  <SelectItem
                    value="HIGH"
                    className="focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 cursor-pointer"
                  >
                    High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status — Custom Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) =>
                  setStatus(v as "TODO" | "IN_PROGRESS" | "DONE")
                }
              >
                <SelectTrigger
                  id="status"
                  className="w-full h-9 bg-background border-border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem
                    value="TODO"
                    className="focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 cursor-pointer"
                  >
                    To Do
                  </SelectItem>
                  <SelectItem
                    value="IN_PROGRESS"
                    className="focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 cursor-pointer"
                  >
                    In Progress
                  </SelectItem>
                  <SelectItem
                    value="DONE"
                    className="focus:bg-blue-50 focus:text-blue-700 data-[highlighted]:bg-blue-50 data-[highlighted]:text-blue-700 cursor-pointer"
                  >
                    Done
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              min={today}
              onChange={(e) => setDueDate(e.target.value)}
              className="focus-visible:ring-blue-500 focus-visible:border-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}