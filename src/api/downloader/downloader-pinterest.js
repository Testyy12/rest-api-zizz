import axios from "axios"
import * as cheerio from "cheerio"

export default (app) => {

    const resolvePinterestShortLink = async (shortUrl) => {
    try {
        const response = await axios.get(shortUrl, {
            maxRedirects: 5,
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Linux; Android 12; SAMSUNG SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/17.0 Chrome/96.0.4664.104 Mobile Safari/537.36',
            },
        })
        return response.request.res.responseUrl
    } catch (err) {
        console.error('Gagal resolve shortlink:', err.message)
        return null
    }
}

const pindl = async (url) => {
    try {
        // 🔗 Resolve pin.it shortlink
        if (url.includes('pin.it')) {
            const resolved = await resolvePinterestShortLink(url)
            if (!resolved) throw new Error('Gagal follow shortlink pin.it')
            url = resolved
        }

        const res = await axios.get(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Linux; Android 12; SAMSUNG SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/17.0 Chrome/96.0.4664.104 Mobile Safari/537.36',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            },
        })

        const $ = cheerio.load(res.data)
        const dataLeaf = $('script[data-test-id="leaf-snippet"]').text()
        const dataVideo = $('script[data-test-id="video-snippet"]').text()

        const info = JSON.parse(dataLeaf || '{}')
        const videoUrl = dataVideo ? JSON.parse(dataVideo).contentUrl : null
        const imageUrl = info.image || null

        const media = {}
        if (imageUrl) media.image = imageUrl
        if (videoUrl) media.video = videoUrl

        return {
            message: 'Pinterest media fetched successfully ✅',
            type: videoUrl ? 'video' : 'image',
            author: {
                name: info.author?.name || null,
                username: info.author?.alternateName || null,
                profile_url: info.author?.url || null,
            },
            title: info.headline || null,
            description: info.articleBody || null,
            published_at: info.datePublished || null,
            source: info.mainEntityOfPage?.['@id'] || url,
            media,
        }
    } catch (e) {
        return {
            status: false,
            message: '❌ Failed to fetch Pinterest media',
            error: e.message,
        }
    }
}

    app.get('/downloader/pindl', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "Parameter 'url' wajib diisi!"
            })
        }

        try {
        const response = await pindl(url);
            res.status(200).json({
                response
                
            })
        } catch (error) {
            console.log(error);
            throw error;
            
        }

        
    })
}
