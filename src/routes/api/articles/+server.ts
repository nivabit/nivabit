import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { authorize } from '$lib/server/auth';
import fs from 'fs';
import path from 'path';

export const GET: RequestHandler = async (event) => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return json(articles);
};

export const POST: RequestHandler = async ({ request, cookies }) => {
  const user = await authorize({ cookies } as any);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await request.formData();

  // Get text values
  const title = form.get('title') as string;
  const excerpt = form.get('excerpt') as string;
  const content = form.get('content') as string;
  const categories = form.getAll('categories').map(String);
  const tags = form.getAll('tags').map(String);
  const status = form.get('status') as string;
  const publishDate = new Date(form.get('publishDate') as string);
  const seoTitle = form.get('seoTitle') as string;
  const seoDescription = form.get('seoDescription') as string;

  // Handle featuredImage upload
  let featuredImage: string | null = null;
  const file = form.get('featuredImage') as File;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name}`;
    const uploadDir = path.join('static', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    featuredImage = `/uploads/${fileName}`;
  }

  // Save article
  const article = await prisma.article.create({
    data: {
      title,
      excerpt,
      content,
      categories,
      status: status as any,
      publishDate,
      tags,
      featuredImage,
      seoTitle,
      seoDescription,
      authorId: user.id
    }
  });

  return json(article, { status: 201 });
};
