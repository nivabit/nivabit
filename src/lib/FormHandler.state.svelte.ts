import { z, ZodSchema } from "zod";

export class FormHandler<T> {
  schema: ZodSchema<T>;
  values: Record<string, any>;
  errors: Record<string, string> = $state({});
  loading = $state(false);

  constructor(schema: ZodSchema<T>, initial: Partial<T> = {}) {
    this.schema = schema;
    this.values = { ...initial };
  }

  setValue(field: string, value: any) {
    this.values[field] = value;
  }

  validate(): boolean {
    const result = this.schema.safeParse(this.values);
    if (!result.success) {
      this.errors = {};
      result.error.errors.forEach(err => {
        const field = err.path.join(".");
        this.errors[field] = err.message;
      });
      return false;
    }
    this.errors = {};
    return true;
  }

  async submit(endpoint: string, options: RequestInit = {}) {
    if (!this.validate()) {
      return { success: false, errors: this.errors };
    }
    this.loading = true;
    this.errors = {}; // clear old errors

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.values),
        ...options,
      });

      const data = await res.json();
      this.loading = false;

      if (!res.ok) {
        // ✅ put error in root for UI
        this.errors.root = data.message || data?.error || "Login failed";
        return { success: false, errors: this.errors };
      }

      return { success: true, ...data };
    } catch (err) {
      this.loading = false;
      this.errors.root = "Network error. Please try again.";
      return { success: false, errors: this.errors };
    }
  }
}
