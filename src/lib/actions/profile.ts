"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2).max(50),
});

export type ProfileState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    // Update Supabase auth metadata
    await supabase.auth.updateUser({
      data: { name: parsed.data.name },
    });

    // Update Prisma user
    await prisma.user.update({
      where: { id: user.id },
      data: { name: parsed.data.name },
    });

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: "Profile updated successfully" };
  } catch (err) {
    console.error(err);
    return { error: "Failed to update profile" };
  }
}