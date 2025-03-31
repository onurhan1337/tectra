import { z } from "zod";

export const FieldTypes = z.enum([
  "text",
  "textarea",
  "email",
  "number",
  "password",
  "tel",
  "url",
  "select",
  "checkbox",
  "radio",
  "date",
  "file",
]);

export type FieldType = z.infer<typeof FieldTypes>;

const ValidationSchema = z.object({
  pattern: z.string().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  required: z.boolean().default(false),
});

export type Validation = z.infer<typeof ValidationSchema>;

const BaseFieldSchema = z.object({
  id: z.string(),
  type: FieldTypes,
  label: z.string(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  validation: ValidationSchema.optional(),
});

const OptionsFieldSchema = BaseFieldSchema.extend({
  options: z.array(z.string()),
});

export const FormFieldSchema = z.discriminatedUnion("type", [
  BaseFieldSchema.extend({ type: z.literal("text") }),
  BaseFieldSchema.extend({ type: z.literal("textarea") }),
  BaseFieldSchema.extend({ type: z.literal("email") }),
  BaseFieldSchema.extend({ type: z.literal("password") }),
  BaseFieldSchema.extend({ type: z.literal("tel") }),
  BaseFieldSchema.extend({ type: z.literal("url") }),
  BaseFieldSchema.extend({ type: z.literal("number") }),
  BaseFieldSchema.extend({ type: z.literal("date") }),
  BaseFieldSchema.extend({ type: z.literal("file") }),

  // Fields with options
  OptionsFieldSchema.extend({ type: z.literal("select") }),
  OptionsFieldSchema.extend({ type: z.literal("radio") }),
  BaseFieldSchema.extend({
    type: z.literal("checkbox"),
    options: z.array(z.string()).optional(),
  }),
]);

export type FormField = z.infer<typeof FormFieldSchema>;

export const FormTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  fields: z.array(FormFieldSchema),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
  updatedAt: z
    .date()
    .optional()
    .default(() => new Date()),
});

export type FormTemplate = z.infer<typeof FormTemplateSchema>;

export const FormSubmissionSchema = z.object({
  id: z.string(),
  formId: z.string(),
  submitterIp: z.string().nullable(),
  data: z.record(z.any()),
  metadata: z.record(z.any()).optional(),
  submittedAt: z.date().default(() => new Date()),
});

export type FormSubmission = z.infer<typeof FormSubmissionSchema>;

export const FormStatusSchema = z.enum(["draft", "published", "archived"]);

export type FormStatus = z.infer<typeof FormStatusSchema>;

export const FormSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  fields: z.array(FormFieldSchema),
  status: FormStatusSchema.default("draft"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  publishedAt: z.date().optional(),
  archivedAt: z.date().optional(),
});

export type Form = z.infer<typeof FormSchema>;
