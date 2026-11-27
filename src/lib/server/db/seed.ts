import 'dotenv/config';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { db, sqlClient, admins } from './index.ts';

async function main() {
	const email = 'superadmin@nivabit.com';
	const password = 'SuperSecurePassword123!';
	const name = 'Olaoluwa Owonikoko';
	const role = 'System Administrator';
	const phone = '+2349071133025';

	const [existing] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

	if (!existing) {
		const hash = await argon2.hash(password);
		await db.insert(admins).values({
			email,
			passwordHash: hash,
			name,
			role,
			phone
		});
		console.log('Admin created ✅');
	} else {
		console.log('Admin already exists ⚡');
	}
}

main()
	.catch((err) => {
		console.error(err);
		process.exitCode = 1;
	})
	.finally(() => sqlClient.end());
