import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://example.com');
    const html = await response.text();

    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(html.substring(0, 3000));
  } catch (err) {
    return res.status(500).json({
      error: 'Gagal fetch example.com',
      detail: err.message
    });
  }
}
