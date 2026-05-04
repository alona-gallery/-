import { list } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const { blobs } = await list();
    const images = blobs
      .filter(b => b.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .map(b => ({ url: b.url, name: b.pathname }))
      .reverse();
    
    return new Response(JSON.stringify(images), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
