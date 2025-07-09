import { pinterest } from "../../../scraper/pin.js"

export default (app) => {
    app.get('/search/pin', async (req, res) => {
        const { text, count } = req.query

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Parameter 'text' wajib diisi!"
            })
        }

        try {
            const result = await pinterest(text)

            if (!result.length) {
                return res.status(404).json({
                    success: false,
                    message: "Data tidak ditemukan atau Pinterest mungkin memblokir akses"
                })
            }

            // Validasi count
            const limit = Math.min(
                parseInt(count) || 10, // default ambil 10 kalau ga diset
                result.length
            )

            const sliced = result.slice(0, limit).map(item => ({
                title: item.caption || '-',
                image: item.image,
                source: item.source,
                upload_by: item.upload_by,
                fullname: item.fullname,
                followers: item.followers
            }))

            res.status(200).json({
                success: true,
                total: sliced.length,
                data: sliced
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Terjadi kesalahan internal Pinterest API'
            })
        }
    })
}
