import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    
    if (!file) {
      return new Response(JSON.stringify({ error: '未选择文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: '文件不能超过10MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });

    return new Response(JSON.stringify({ url: blob.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
