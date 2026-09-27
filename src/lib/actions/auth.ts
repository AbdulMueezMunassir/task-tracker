"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { prisma } from "@/lib/prisma";

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function signupAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
  email: formData.get("email"),
  password: formData.get("password"),
  name: formData.get("name"),
  confirmPassword: formData.get("confirmPassword"),
};

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // ⭐ Sync user to Prisma
  if (data.user) {
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: {
          email: parsed.data.email,
          name: parsed.data.name,
        },
        create: {
          id: data.user.id,
          email: parsed.data.email,
          name: parsed.data.name,
        },
      });
    } catch (err) {
      console.error("Prisma user sync failed:", err);
      // Don't block signup — auth succeeded
    }
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}