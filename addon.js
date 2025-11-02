const { addonBuilder } = require("stremio-addon-sdk")
const fetch = require('node-fetch')
const Parser = require('m3u8-parser')

// Load manifest from the canonical static file to avoid duplication
// (we keep a single source of truth in public/manifest.json)
const manifest = require("./public/manifest.json")
const builder = new addonBuilder(manifest)

async function getChannels() {
    try {
        const response = await fetch('https://www.tdtchannels.com/lists/tv.m3u8')
        const m3u8Content = await response.text()
        
        const parser = new Parser()
        parser.push(m3u8Content)
        parser.end()

        return parser.manifest.segments.map((segment, index) => {
            const name = segment.uri.split('/').pop().split('.')[0]
            return {
                id: `channel_${index}`,
                type: "tv",
                name: segment.title || name,
                poster: "https://www.tdtchannels.com/favicon.png",
                stream: segment.uri
            }
        })
    } catch (error) {
        console.error('Error fetching channels:', error)
        return []
    }
}

builder.defineCatalogHandler(async ({type, id}) => {
    console.log("request for catalogs: "+type+" "+id)
    if (type === "tv") {
        const channels = await getChannels()
        return Promise.resolve({ metas: channels.map(channel => ({
            id: channel.id,
            type: "tv",
            name: channel.name,
            poster: channel.poster
        }))})
    }
    return Promise.resolve({ metas: [] })
})

builder.defineMetaHandler(async ({type, id}) => {
    console.log("request for meta: "+type+" "+id)
    if (type === "tv") {
        const channels = await getChannels()
        const channel = channels.find(ch => ch.id === id)
        if (channel) {
            return Promise.resolve({
                meta: {
                    id: channel.id,
                    type: "tv",
                    name: channel.name,
                    poster: channel.poster
                }
            })
        }
    }
    return Promise.resolve({ meta: null })
})

builder.defineStreamHandler(async ({type, id}) => {
    console.log("request for streams: "+type+" "+id)
    if (type === "tv") {
        const channels = await getChannels()
        const channel = channels.find(ch => ch.id === id)
        if (channel) {
            return Promise.resolve({
                streams: [{
                    url: channel.stream,
                    title: channel.name
                }]
            })
        }
    }
    return Promise.resolve({ streams: [] })
})

module.exports = builder.getInterface()