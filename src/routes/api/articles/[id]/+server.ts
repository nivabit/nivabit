
import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { authorize } from '$lib/server/auth';
import fs from 'fs';
import path from 'path';


export const GET: RequestHandler = async({ params }) => {
  const article = await prisma.article.findUnique({ where: { id: params.id } });
  if (!article) return json({ error: 'Not found' }, { status: 404 });
  return json(article);
}

export const PUT: RequestHandler = async ({ params, request, cookies }) => {
  const user = await authorize({ cookies } as any);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ✅ Check if article exists
  const existingArticle = await prisma.article.findUnique({ where: { id: params.id } });
  if (!existingArticle) {
    return json({ error: 'Not found' }, { status: 404 });
  }

  // 2️⃣ Handle full update (formData with optional file)
  const form = await request.formData();

  const title = form.get('title') as string;
  const excerpt = form.get('excerpt') as string;
  const content = form.get('content') as string;
  const categories = form.getAll('categories').map(String);
  const tags = form.getAll('tags').map(String);
  const status = form.get('status') as string;
  const publishDate = new Date(form.get('publishDate') as string);
  const seoTitle = form.get('seoTitle') as string;
  const seoDescription = form.get('seoDescription') as string;

  let featuredImage: string | null = existingArticle.featuredImage;
  const file = form.get('featuredImage') as File;

  if (file && file.size > 0) {
    // ✅ Delete old image if exists
    if (existingArticle.featuredImage) {
      const oldPath = path.join('static', existingArticle.featuredImage);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // ✅ Save new image
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

  // ✅ Update article
  const article = await prisma.article.update({
    where: { id: params.id },
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
      seoDescription
    }
  });

  return json(article);
};

export const DELETE: RequestHandler = async({ params, cookies }) => {
  const user = await authorize({ cookies } as any);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if article exists
  const existingArticle = await prisma.article.findUnique({ where: { id: params.id } });
  if (!existingArticle) {
    return json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.article.delete({ where: { id: params.id } });
  return json({ success: true });
}

export const PATCH: RequestHandler = async ({ params, request }) => {
  try {
    const data = await request.json();

    if (typeof data.views !== 'number') {
      return json({ error: 'views must be a number' }, { status: 400 });
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: { views: data.views }
    });

    return json(article);
  } catch (err) {
    console.error(err);
    return json({ error: 'Failed to update views' }, { status: 500 });
  }
};