export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ error: 'Blob 存储未配置' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const listRes = await fetch('https://blob.vercel-storage.com', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!listRes.ok) throw new Error('获取列表失败');

    const data = await listRes.json();
    const images = (data.blobs || [])
      .filter(b => /\.(jpg|jpeg|png|gif|webp)$/i.test(b.pathname))
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
