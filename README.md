# svg2png

Simple Cloudflare Worker to render SVG to PNG with [svg2png-wasm](https://github.com/ssssota/svg2png-wasm).

POST to `/png` with the SVG in an `svg` field, and optional `height`, `width`, and/or `scale` params.

Will work bound to a custom domain, or on a `/svg2png` route. Modify the code for a different base path.

Note, this will use "somewhat more" CPU time than the free Workers plan allows.

