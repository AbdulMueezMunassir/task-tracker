import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-900">Task Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">{user?.email}</span>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-neutral-900">
          Welcome, {user?.user_metadata?.name ?? user?.email}
        </h2>
        <p className="text-neutral-500 mt-2">
          Dashboard 
        </p>
      </main>
    </div>
  );
}