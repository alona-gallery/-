import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

export async function POST(request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    
    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '文件不能超过10MB' }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
