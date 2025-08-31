
import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async({ params }) => {
  const article = await prisma.article.findUnique({ where: { id: params.id } });
  if (!article) return json({ error: 'Not found' }, { status: 404 });
  return json(article);
}

export const PUT: RequestHandler = async({ params, request }) => {
  const data = await request.json();

  const article = await prisma.article.update({
    where: { id: params.id },
    data: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      categories: data.categories,
      status: data.status,
      publishDate: new Date(data.publishDate),
      tags: data.tags,
      featuredImage: data.featuredImage,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription
    }
  });

  return json(article);
}

export const DELETE: RequestHandler = async({ params }) => {
  await prisma.article.delete({ where: { id: params.id } });
  return json({ success: true });
}
