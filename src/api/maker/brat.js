import { createCanvas } from 'canvas'

export default (app) => {
  // ✅ Ukuran fix brat image
const WIDTH = 900;
const HEIGHT = 900;
const COLS = 3;

function generateBratImage(text) {
    const words = text.trim().split(/\s+/);
    const rows = Math.ceil(words.length / COLS);

    const cellWidth = WIDTH / COLS;
    const cellHeight = HEIGHT / rows;

    // 🎯 Auto-scale font berdasarkan tinggi baris
    const fontSize = Math.floor(cellHeight * 0.6);

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // 🏳️ background putih
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 🖋️ styling teks
    ctx.fillStyle = "#000000";
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 🔁 Tulis tiap kata
    words.forEach((word, index) => {
        const col = index % COLS;
        const row = Math.floor(index / COLS);

        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;

        ctx.fillText(word, x, y);
    });

    return canvas.toBuffer('image/png');
}

    app.get('/maker/brat-image', async (req, res) => {
        const { text = "Halo dunia" } = req.query;

    const cleanText = decodeURIComponent(text).replace(/\+/g, " ");
    const imageBuffer = generateBratImage(cleanText);

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
    })
}