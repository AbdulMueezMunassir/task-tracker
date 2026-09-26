import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/molecules/StatsCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tasks = user
    ? await prisma.task.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const now = new Date();
  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    done: tasks.filter((t) => t.status === "DONE").length,
    overdue: tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "DONE"
    ).length,
  };

  const overdueTasks = tasks.filter(
    (t) => t.dueDate && new Date(t.dueDate) < now && t.status !== "DONE"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.user_metadata?.name ?? user?.email}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here&apos;s your workspace overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard label="Total Tasks" value={stats.total} />
        <StatsCard label="To Do" value={stats.todo} />
        <StatsCard label="In Progress" value={stats.inProgress} />
        <StatsCard label="Done" value={stats.done} />
        <StatsCard label="Overdue" value={stats.overdue} variant="danger" />
      </div>

      {overdueTasks.length > 0 && (
        <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl">
          <h2 className="text-sm font-semibold text-rose-900 mb-3">
            ⚠ Overdue Tasks ({overdueTasks.length})
          </h2>
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-rose-200"
              >
                <span className="text-sm font-medium">{task.title}</span>
                <span className="text-xs text-rose-600 font-medium">
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="p-8 bg-card border border-border rounded-xl text-center">
          <p className="text-sm text-muted-foreground">
            No tasks yet. Go to <strong>Tasks / Board</strong> to create one.
          </p>
        </div>
      )}
    </div>
  );
}