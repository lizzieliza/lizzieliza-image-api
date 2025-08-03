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

    // Coba ambil vqd dengan regex yang aman
    const match = html.match(/vqd='(.+?)'/);

    // Jika gagal mendapatkan token, kirim cuplikan HTML sebagai debug
    if (!match) {
      return res.status(500).json({
        error: 'Token vqd tidak ditemukan',
        html_preview: html.substring(0, 3000)
      });
    }

    const vqd = match[1];
    const apiUrl = `https://duckduckgo.com/i.js?q=${encodeURIComponent(q)}&vqd=${vqd}&o=json`;
    const imageRes = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = await imageRes.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data.results || []);

  } catch (err) {
    return res.status(500).json({
      error: 'Terjadi kesalahan',
      details: err.message
    });
  }
}
