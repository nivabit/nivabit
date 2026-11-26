import * as v from 'valibot';

export class FormHandler<TSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>> {
	schema: TSchema;
	values: Record<string, any>;
	errors: Record<string, string> = $state({});
	touched: Record<string, boolean> = $state({});
	loading = $state(false);

	constructor(schema: TSchema, initial: Record<string, any> = {}) {
		this.schema = schema;
		this.values = { ...initial };
	}

	setValue(field: string, value: any) {
		this.values[field] = value;
		this.touched[field] = true;
		this.validateField(field);
	}

	validateField(field: string) {
		const result = v.safeParse(this.schema, this.values);
		if (!result.success) {
			const flat = v.flatten(result.issues).nested ?? {};
			const err = flat[field]?.[0];
			if (err) {
				this.errors[field] = err;
			} else {
				delete this.errors[field];
			}
		} else {
			delete this.errors[field];
		}
	}

	validate(): boolean {
		const result = v.safeParse(this.schema, this.values);
		if (!result.success) {
			const flat = v.flatten(result.issues).nested ?? {};
			this.errors = {};
			for (const [field, messages] of Object.entries(flat)) {
				if (messages?.[0]) this.errors[field] = messages[0];
			}
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
		this.errors = {};

		try {
			const data = await requestFn(this.values);
			this.loading = false;
			return { success: true, ...data };
		} catch (err: any) {
			this.loading = false;
			this.errors.root = err.message || 'Request failed';
			return { success: false, errors: this.errors };
		}
	}
}
