#!/usr/bin/env node

const { serveHTTP, publishToCentral } = require("stremio-addon-sdk")
const addonInterface = require("./addon")
serveHTTP(addonInterface, { port: process.env.PORT || 3000 })

// Publish to Stremio central only when explicitly enabled via environment variable.
// This avoids accidental publishing during deploys/tests. To publish, set:
//   PUBLISH_TO_CENTRAL=1
// and then run the server (or call the function).
// The manifest URL should point to the public manifest served by Vercel.
if (process.env.PUBLISH_TO_CENTRAL === '1') {
	try {
		publishToCentral("https://jopotv.vercel.app/manifest.json")
		console.log('publishToCentral invoked for https://jopotv.vercel.app/manifest.json')
	} catch (err) {
		console.error('Error calling publishToCentral:', err)
	}
}
