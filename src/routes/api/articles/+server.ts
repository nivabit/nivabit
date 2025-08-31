import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';


export const GET: RequestHandler = async() => {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return json(articles);
}

export const POST: RequestHandler = async({ request }) => {
  const data = await request.json();

  const article = await prisma.article.create({
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

  return json(article, { status: 201 });
}
