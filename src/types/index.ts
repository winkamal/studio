
export type Post = {
  slug: string;
  title: string;
  author: string;
  date: string;
  coverImage: string;
  coverImageHint: string;
  excerpt: string;
  content: string;
  tags: string[];
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  coverImage: string;
  coverImageHint: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export type AboutContent = {
    id: string;
    name: string;
    imageUrl: string;
    bio: string;
    content: string;
    twitterUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    backgroundColor?: string;
    blogFontColor?: string;
    gradientColor1?: string;
    gradientColor2?: string;
    gradientColor3?: string;
    gradientColor4?: string;
};
