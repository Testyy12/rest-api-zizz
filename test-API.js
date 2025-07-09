import express from 'express';
import { createCanvas } from 'canvas';

const router = express.Router();

// 🖼️ Fungsi untuk generate image dari text
function generateImage(text, width = 720, height = 480) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, width, height);

    // teks
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, width / 2, height / 2);

    return canvas.toBuffer('image/png');
}

// ✅ Route: /api/m/brat
app.get('/mabrat', async (req, res) => {
    const { text = "Halo dunia" } = req.query;

    const cleanText = decodeURIComponent(text).replace(/\+/g, " ");
    const imageBuffer = generateImage(cleanText);

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
});



/*
{
"status": true,
"creator": "Zizz-Shop",
"success": true,
"total": 2,
"data": [
{
  "title": "tung tung sahur",
  "image": "https://i.pinimg.com/originals/09/c5/bf/09c5bfc56e48d3fa98504bfc5ab9b91a.png",
  "source": "https://id.pinterest.com/pin/2462974792448041",
  "upload_by": "maki_nano",
  "fullname": "Maki Nano",
  "followers": 2243
},
{
  "title": "Tung tung tung tung tung tung tung tung tung Sahur",
  "image": "https://i.pinimg.com/originals/18/39/92/1839920704a6eb361dc605a33a73fea3.jpg",
  "source": "https://id.pinterest.com/pin/13088655162855199",
  "upload_by": "gabrielyfigueir",
  "fullname": "gabriely Figueiredo",
  "followers": 4
}
]
}
*/