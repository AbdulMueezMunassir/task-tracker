import { z } from "zod";

export const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const taskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

/**
 * Reusable due-date field with past-date prevention.
 * Accepts: ISO datetime string, empty string, null, or undefined.
 * Rejects: past dates.
 */
const dueDateField = z
  .string()
  .datetime({ message: "Invalid date format" })
  .optional()
  .nullable()
  .or(z.literal(""))
  .refine(
    (val) => !val || new Date(val) >= new Date(new Date().toDateString()),
    { message: "Due date cannot be in the past" }
  );

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .trim()
    .optional()
    .or(z.literal("")),
  priority: taskPriorityEnum.default("MEDIUM"),
  status: taskStatusEnum.default("TODO"),
  dueDate: dueDateField,
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;