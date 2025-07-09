import axios from 'axios';

export default (app) => {
    async function AllInOneDl(url) {
        const config = {
            method: 'GET',
            url: 'https://www.apis-anomaki.zone.id/downloader/aio?initialUrl=' + encodeURIComponent(url),
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36',
                'dnt': '1',
                'origin': 'https://www.aio-anomaki.zone.id',
                'referer': 'https://www.aio-anomaki.zone.id/'
            }
        };

        try {
            const { data } = await axios.request(config);
            return data;
        } catch (err) {
            console.error("Error fetching content from AIO", err);
            throw err;
        }
    }

    app.get('/downloader/aio', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Parameter 'url' wajib diisi!"
            });
        }

        try {
            const result = await AllInOneDl(url);

            const data = result?.result?.[0];
            const author = result?.creator;

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Data tidak ditemukan atau link tidak valid"
                });
            }

            res.status(200).json({
                credits: author || 'Unknown',
                data: {
                    title: data.title,
                    video: data.video_file_url,
                    thumbnail: data.videoimg_file_url,
                    watermark: data.image
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Terjadi kesalahan internal'
            });
        }
    });
};
