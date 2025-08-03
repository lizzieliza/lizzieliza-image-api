export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).send('Query kosong');
  }

  try {
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://duckduckgo.com/',
        'DNT': '1',
      }
    });

    const html = await response.text();

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(html);
  } catch (err) {
    return res.status(500).send('Gagal fetch: ' + err.message);
  }
}
