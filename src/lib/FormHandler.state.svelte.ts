// src/lib/FormHandler.ts
import { z, ZodSchema } from "zod";

export class FormHandler<T> {
  schema: ZodSchema<T>;
  values: Record<string, any>;
  errors: Record<string, string> = $state({});
  touched: Record<string, boolean> = $state({});
  loading = $state(false);

  constructor(schema: ZodSchema<T>, initial: Partial<T> = {}) {
    this.schema = schema;
    this.values = { ...initial };
  }

  setValue(field: string, value: any) {
    this.values[field] = value;
    this.touched[field] = true; // user interacted
    this.validateField(field);
  }

  validateField(field: string) {
    const result = this.schema.safeParse(this.values);
    if (!result.success) {
      // check if field has an error
      const err = result.error.errors.find(e => e.path.join(".") === field);
      if (err) {
        this.errors[field] = err.message;
      } else {
        delete this.errors[field];
      }
    } else {
      delete this.errors[field];
    }
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

  async submit(requestFn: (data: any) => Promise<any>) {
    if (!this.validate()) {
      return { success: false, errors: this.errors };
    }
    this.loading = true;
    this.errors = {}; // clear old errors

    try {
      const data = await requestFn(this.values);
      this.loading = false;
      return { success: true, ...data };
    } catch (err: any) {
      this.loading = false;
      this.errors.root = err.message || "Request failed";
      return { success: false, errors: this.errors };
    }
  }
}
