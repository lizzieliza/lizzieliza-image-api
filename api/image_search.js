import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query kosong' });
  }

  try {
    const duckRes = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(q)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const html = await duckRes.text();

    // Ambil hanya potongan awal HTML (agar tidak crash)
    const preview = html.substring(0, 3000); // potong 3000 karakter

    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(preview);

  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil HTML', details: err.message });
  }
}
