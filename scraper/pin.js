// pinterest.js
import axios from 'axios'
import https from 'https'

const agent = new https.Agent({
  rejectUnauthorized: true,
  maxVersion: 'TLSv1.3',
  minVersion: 'TLSv1.2'
})

export async function getCookies() {
  try {
    const response = await axios.get('https://www.pinterest.com/csrf_error/', { httpsAgent: agent })
    const setCookieHeaders = response.headers['set-cookie']
    if (setCookieHeaders) {
      const cookies = setCookieHeaders.map(cookieString => {
        const cookieParts = cookieString.split(';')
        const cookieKeyValue = cookieParts[0].trim()
        return cookieKeyValue
      })
      return cookies.join('; ')
    } else {
      return null
    }
  } catch {
    return null
  }
}

export async function pinterest(query) {
  try {
    const cookies = await getCookies()
    if (!cookies) return []

    const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/'
    const params = {
      source_url: `/search/pins/?q=${query}`,
      data: JSON.stringify({
        options: {
          isPrefetch: false,
          query,
          scope: 'pins',
          no_fetch_context_on_resource: false
        },
        context: {}
      }),
      _: Date.now()
    }

    const headers = {
      'accept': 'application/json, text/javascript, */*, q=0.01',
      'accept-encoding': 'gzip, deflate',
      'accept-language': 'en-US,en;q=0.9',
      'cookie': cookies,
      'dnt': '1',
      'referer': 'https://www.pinterest.com/',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
      'x-app-version': 'c056fb7',
      'x-pinterest-appstate': 'active',
      'x-pinterest-pws-handler': 'www/[username]/[slug].js',
      'x-pinterest-source-url': '/hargr003/cat-pictures/',
      'x-requested-with': 'XMLHttpRequest'
    }

    const { data } = await axios.get(url, {
      httpsAgent: agent,
      headers,
      params
    })

    const container = []
    const results = data.resource_response?.data?.results || []

    results.filter(v => v.images?.orig).forEach(result => {
      container.push({
        upload_by: result.pinner.username,
        fullname: result.pinner.full_name,
        followers: result.pinner.follower_count,
        caption: result.grid_title,
        image: result.images.orig.url,
        source: `https://id.pinterest.com/pin/${result.id}`
      })
    })

    return container
  } catch (e) {
    console.error("Pinterest error:", e.message || e)
    return []
  }
}

