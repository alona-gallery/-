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

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Blob 存储未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 用 fetch 直接上传到 Vercel Blob
    const blobRes = await fetch(`https://blob.vercel-storage.com/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': file.type || 'application/octet-stream',
        'Content-Length': file.size,
      },
      body: file.stream(),
    });

    if (!blobRes.ok) {
      throw new Error('上传失败');
    }

    const blobData = await blobRes.json();
    return new Response(JSON.stringify({ url: blobData.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
