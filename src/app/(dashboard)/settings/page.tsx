"use client";

import { useActionState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfileAction, type ProfileState } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const initialState: ProfileState = {};

export default function SettingsPage() {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? "");
      setUserName((data.user?.user_metadata?.name as string) ?? "");
    });
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings.
        </p>
      </div>

      <div className="p-6 bg-white/70 backdrop-blur-md border border-slate-200/70 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={userName}
              placeholder="Your name"
              required
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userEmail}
              disabled
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-500">
              Email cannot be changed.
            </p>
          </div>

          {state.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}
          {state.success && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              {state.success}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}