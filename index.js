const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const fetch = require('node-fetch');

// URL de tu lista m3u (puedes cambiarla fácilmente)
const M3U_URL = "https://ipfs.io/ipns/k2k4r8oqlcjxsritt5mczkcn4mmvcmymbqw7113fz2flkrerfwfps004/data/listas/lista_iptv.m3u";

// Función para leer y parsear canales AceStream de tu lista m3u
async function getChannelsFromM3U(url) {
    const response = await fetch(url);
    const m3u = await response.text();

    const canales = [];
    const lines = m3u.split('\n');
    let currentName = "";
    for (let line of lines) {
        if (line.startsWith('#EXTINF')) {
            // Extrae el nombre del canal
            const match = line.match(/#EXTINF:-1.*,(.*)/);
            if (match) currentName = match[1].trim();
        }
        if (line.startsWith('acestream://')) {
            canales.push({
                name: currentName || "AceStream",
                url: line.trim()
            });
        }
    }
    return canales;
}

const builder = new addonBuilder({
    id: 'org.jopotvaddon',
    version: '1.0.0',
    name: 'JopoTv by joheos11',
    catalogs: [{ type: 'tv', id: 'ace_channels', name: "AceStream Channels" }],
    resources: ['catalog', 'stream'],
    types: ['tv'],
    idPrefixes: ['ace'],
});

builder.defineCatalogHandler(async function(args) {
    if (args.type === 'tv') {
        const canales = await getChannelsFromM3U(M3U_URL);
        return {
            metas: canales.map((canal, i) => ({
                id: 'ace_' + i,
                name: canal.name,
                type: 'tv',
                poster: '', // Puedes agregar logos aquí si tienes
            }))
        };
    }
    return { metas: [] };
});

builder.defineStreamHandler(async function(args) {
    const canales = await getChannelsFromM3U(M3U_URL);
    const idx = parseInt(args.id.replace('ace_', ''));
    if (canales[idx]) {
        return {
            streams: [{
                url: canales[idx].url // AceStream URL
            }]
        };
    }
    return { streams: [] };
});

serveHTTP(builder.getInterface(), { port: process.env.PORT || 7000 });
