
export interface ArticleData {
    title: string;
    excerpt: string;
    content: string;
    categories: string[];
    status: 'DRAFT' | 'PUBLISHED';
    tags: string[];
    featuredImage?: File | null;
    seoTitle: string;
    seoDescription: string;
    featuredImageURL?: string;
}


export interface GetarticleData {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    categories: string[];
    status: 'DRAFT' | 'PUBLISHED';
    tags: string[];
    featuredImage?: string | null;
    seoTitle: string;
    seoDescription: string;
    featuredImageURL?: string;
    createdAt: string;
}

