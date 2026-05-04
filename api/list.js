import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export async function GET() {
  try {
    const { blobs } = await list();
    const images = blobs
      .filter(b => b.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .map(b => ({ url: b.url, name: b.pathname }))
      .reverse();
    
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
