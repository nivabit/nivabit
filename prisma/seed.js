import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
	const email = 'fanekad466@reifide.com';
	const password = 'SuperSecurePassword123!';
	const name = 'John Doe';
	const role = 'System Administrator';
	const phone = '+2348012845678';

	const hash = await argon2.hash(password);

	const existing = await prisma.admin.findUnique({ where: { email } });

	if (!existing) {
		await prisma.admin.create({
			data: {
				email,
				passwordHash: hash,
				name,
				role,
				phone
			}
		});
		console.log('Admin created ✅');
	} else {
		console.log('Admin already exists ⚡');
	}
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
