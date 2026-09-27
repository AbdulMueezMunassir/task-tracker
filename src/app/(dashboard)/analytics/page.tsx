import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const tasks = user
    ? await prisma.task.findMany({
        where: { userId: user.id },
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
    low: tasks.filter((t) => t.priority === "LOW").length,
    medium: tasks.filter((t) => t.priority === "MEDIUM").length,
    high: tasks.filter((t) => t.priority === "HIGH").length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Insights into your task workflow.
        </p>
      </div>

      {/* Completion Rate */}
      <div className="p-6 bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-xl shadow-sm">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Completion Rate
        </p>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-4xl font-bold text-blue-600">
            {completionRate}%
          </span>
          <span className="text-sm text-slate-500">
            {stats.done} of {stats.total} tasks
          </span>
        </div>
        <div className="mt-4 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Status Breakdown */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "To Do", value: stats.todo, color: "bg-slate-400" },
            { label: "In Progress", value: stats.inProgress, color: "bg-blue-600" },
            { label: "Done", value: stats.done, color: "bg-emerald-500" },
            { label: "Overdue", value: stats.overdue, color: "bg-rose-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${stat.color}`} />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Breakdown */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Priority Breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "High", value: stats.high, color: "bg-rose-500" },
            { label: "Medium", value: stats.medium, color: "bg-amber-500" },
            { label: "Low", value: stats.low, color: "bg-emerald-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${stat.color}`} />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}