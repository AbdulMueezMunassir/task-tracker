import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/molecules/StatsCard";
import { DashboardTasksList } from "@/components/organisms/DashboardTasksList";

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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard label="Total Tasks" value={stats.total} />
        <StatsCard label="To Do" value={stats.todo} />
        <StatsCard label="In Progress" value={stats.inProgress} />
        <StatsCard label="Done" value={stats.done} />
        <StatsCard label="Overdue" value={stats.overdue} variant="danger" />
      </div>

      {/* Recent Tasks with Search */}
      <DashboardTasksList tasks={tasks} />
    </div>
  );
}