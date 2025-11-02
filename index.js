const { addonBuilder } = require('stremio-addon-sdk');
const axios = require('axios');

const manifest = {
  id: 'org.jopotv',
  version: '1.0.0',
  name: 'JoPoTV',
  description: 'Canales TDT España desde TDTChannels',
  types: ['tv'],
  catalogs: [
    {
      type: 'tv',
      id: 'tdtchannels',
      name: 'Canales TDT España'
    }
  ],
  resources: ['catalog', 'stream']
};

const builder = new addonBuilder(manifest);

let canales = [];

async function cargarCanales() {
  if (canales.length) return canales;
  const url = 'https://www.tdtchannels.com/lists/tv.m3u8';
  const { data } = await axios.get(url);
  const lines = data.split('\n');

  let current = {};
  for (let line of lines) {
    if (line.startsWith('#EXTINF')) {
      const match = line.match(/tvg-name="([^"]+)".*group-title="([^"]*)",(.*)/);
      if (match) {
        current = {
          name: match[1] || match[3],
          group: match[2],
          id: match[1].replace(/\s+/g, '_'),
        };
      }
    } else if (line.startsWith('http')) {
      current.url = line.trim();
      canales.push(current);
      current = {};
    }
  }

  return canales;
}

builder.defineCatalogHandler(async () => {
  const lista = await cargarCanales();
  return {
    metas: lista.map(c => ({
      id: c.id,
      type: 'tv',
      name: c.name,
      poster: 'https://i.postimg.cc/0Ng19YKY/image.png',
      posterShape: 'square',
    }))
  };
});

builder.defineStreamHandler(async ({ id }) => {
  const lista = await cargarCanales();
  const canal = lista.find(c => c.id === id);
  if (!canal) return { streams: [] };
  return {
    streams: [
      {
        url: canal.url,
        title: canal.name
      }
    ]
  };
});

module.exports = builder.getInterface();

