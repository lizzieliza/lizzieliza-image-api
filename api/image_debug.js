export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query kosong' });
  }

  try {
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;

    const duckRes = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://duckduckgo.com/',
        'DNT': '1',
      }
    });

    const html = await duckRes.text();

    // Debug baris ini jika perlu
    const match = html.match(/vqd='([a-zA-Z0-9\-]+)'/);

    if (!match) {
      return res.status(500).json({
        error: 'Gagal mendapatkan token vqd',
        debug: html.substring(0, 500), // tampilkan sebagian isi HTML
      });
    }

    const vqd = match[1];
    const imageApiUrl = `https://duckduckgo.com/i.js?q=${encodeURIComponent(q)}&vqd=${vqd}&o=json`;

    const imageRes = await fetch(imageApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    });

    const data = await imageRes.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data.results || []);
  } catch (err) {
    return res.status(500).json({ error: 'Terjadi kesalahan', detail: err.message });
  }
}
