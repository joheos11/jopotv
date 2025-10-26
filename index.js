const { addonBuilder } = require("stremio-addon-sdk");
const axios = require("axios");

// Tu lista M3U principal (puedes adaptarlo para varias):
const M3U_URL = "https://ipfs.io/ipns/k2k4r8oqlcjxsritt5mczkcn4mmvcmymbqw7113fz2flkrerfwfps004/data/listas/lista_iptv.m3u";

let m3uCache = {};

async function parseM3U(url) {
    const res = await axios.get(url);
    const lines = res.data.split('\n');
    let currentTitle = '';
    let currentLogo = '';
    let streams = [];
    
    lines.forEach(line => {
        if (line.startsWith('#EXTINF')) {
            const titleMatch = line.match(/,(.*)$/);
            currentTitle = titleMatch ? titleMatch[1].trim() : '';
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            currentLogo = logoMatch ? logoMatch[1] : '';
        } else if (line.startsWith('http') || line.startsWith('acestream')) {
            streams.push({ title: currentTitle, url: line.trim(), logo: currentLogo });
            currentTitle = '';
            currentLogo = '';
        }
    });
    return streams;
}

const builder = new addonBuilder({
    id: "org.joheos11.acestreamiptv",
    version: "1.0.0",
    name: "AceStream IPTV by joheos11",
    description: "Addon Stremio – canales IPTV via AceStream/Proxy .m3u.",
    resources: ["stream"],
    types: ["tv"],
    catalogs: [],
    idPrefixes: [ "iptv", "acestream" ]
});

builder.defineStreamHandler(async ({type, id}) => {
    if (!m3uCache[M3U_URL]) {
        m3uCache[M3U_URL] = await parseM3U(M3U_URL);
    }
    const streams = m3uCache[M3U_URL];
    // Busca el canal cuyo título coincida (puedes adaptar a id único)
    const canal = streams.find(s => s.title.toLowerCase() === id.toLowerCase());
    if (!canal) return { streams: [] };

    return {
        streams: [
            {
                title: canal.title,
                url: canal.url,
                ...(canal.logo ? {icon: canal.logo} : {})
            }
        ]
    };
});

module.exports = builder.getInterface();