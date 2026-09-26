import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.user_metadata?.name ?? user?.email}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's your workspace overview.
        </p>
      </div>

      {/* Stat Cards Placeholder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Tasks", value: "0" },
          { label: "To Do", value: "0" },
          { label: "In Progress", value: "0" },
          { label: "Done", value: "0" },
          { label: "Overdue", value: "0" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 bg-card border border-border rounded-xl shadow-sm"
          >
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="p-6 bg-card border border-border rounded-xl">
        <p className="text-sm text-muted-foreground">
          Tasks will appear here soon.
        </p>
      </div>
    </div>
  );
}