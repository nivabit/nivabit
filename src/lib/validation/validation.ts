import * as v from 'valibot';

export const loginSchema = v.object({
	email: v.pipe(v.string(), v.trim(), v.email('Invalid email format')),
	_password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters'))
});

export const forgotPasswordSchema = v.object({
	email: v.pipe(v.string(), v.trim(), v.email('Invalid email format'))
});

export const resetPasswordSchema = v.pipe(
	v.object({
		token: v.pipe(
			v.string(),
			v.nonEmpty('Token is required'),
			v.minLength(10, 'Invalid token')
		),
		_password: v.pipe(
			v.string(),
			v.minLength(8, 'Password must be at least 8 characters'),
			v.regex(/[0-9]/, 'Password must contain at least one number'),
			v.regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
			v.regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
		),
		_confirmPassword: v.pipe(
			v.string(),
			v.minLength(8, 'Confirm password must be at least 8 characters')
		)
	}),
	v.forward(
		v.partialCheck(
			[['_password'], ['_confirmPassword']],
			(input) => input._password === input._confirmPassword,
			'Passwords do not match'
		),
		['_confirmPassword']
	)
);

export const contactSchema = v.object({
	name: v.pipe(v.string(), v.trim(), v.minLength(2, 'Name must be at least 2 characters.')),
	email: v.pipe(v.string(), v.trim(), v.email('Enter a valid email address.')),
	services: v.optional(v.string(), ''),
	subject: v.optional(v.string(), 'Lead from contact'),
	message: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(5, 'Tell us a little about your product idea (min 5 characters).')
	)
});

export const subscribeNewsletterSchema = v.object({
	email: v.pipe(v.string(), v.trim(), v.email('Please enter a valid email address'))
});

export const sendNewsletterSchema = v.object({
	subject: v.pipe(v.string(), v.trim(), v.nonEmpty('Subject is required')),
	message: v.pipe(v.string(), v.trim(), v.nonEmpty('Message is required'))
});

const phoneRegex = /^\+?[0-9\-\s()]{7,20}$/;

export const profileSchema = v.object({
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(2, 'Name must be at least 2 characters'),
		v.maxLength(50, 'Name too long')
	),
	phone: v.optional(
		v.union([
			v.literal(''),
			v.pipe(v.string(), v.trim(), v.regex(phoneRegex, 'Invalid phone number'))
		]),
		''
	)
});

export const changePasswordSchema = v.pipe(
	v.object({
		_oldPassword: v.pipe(
			v.string(),
			v.minLength(6, 'Old password must be at least 6 characters'),
			v.maxLength(100, 'Password too long')
		),
		_newPassword: v.pipe(
			v.string(),
			v.minLength(8, 'New password must be at least 8 characters'),
			v.maxLength(100, 'Password too long'),
			v.regex(/[A-Z]/, 'Password must include an uppercase letter'),
			v.regex(/[a-z]/, 'Password must include a lowercase letter'),
			v.regex(/[0-9]/, 'Password must include a number'),
			v.regex(/[^a-zA-Z0-9]/, 'Password must include a special character')
		),
		_confirmPassword: v.pipe(v.string(), v.minLength(8, 'Confirm password is required'))
	}),
	v.forward(
		v.partialCheck(
			[['_newPassword'], ['_confirmPassword']],
			(input) => input._newPassword === input._confirmPassword,
			'Passwords do not match'
		),
		['_confirmPassword']
	)
);
