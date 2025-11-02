const { addonBuilder } = require("stremio-addon-sdk")

// Load manifest from the canonical static file to avoid duplication
// (we keep a single source of truth in public/manifest.json)
const manifest = require("./public/manifest.json")
const builder = new addonBuilder(manifest)

builder.defineCatalogHandler(({type, id, extra}) => {
	console.log("request for catalogs: "+type+" "+id)
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
	return Promise.resolve({ metas: [
		{
			id: "tt1254207",
			type: "movie",
			name: "The Big Buck Bunny",
			poster: "https://peach.blender.org/wp-content/uploads/bbb-splash.png"
		}
	] })
})

builder.defineMetaHandler(({type, id}) => {
	console.log("request for meta: "+type+" "+id)
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineMetaHandler.md
	return Promise.resolve({ meta: null })
})

builder.defineStreamHandler(({type, id}) => {
	console.log("request for streams: "+type+" "+id)
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
	if (type === "movie" && id === "tt1254207") {
		// serve one stream to big buck bunny
		const stream = { url: "https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_h264.mov" }
		return Promise.resolve({ streams: [stream] })
	}

	// otherwise return no streams
	return Promise.resolve({ streams: [] })
})

module.exports = builder.getInterface()