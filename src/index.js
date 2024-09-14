import { Hono } from 'hono';
import { initialize, svg2png } from 'svg2png-wasm';
import wasm from 'svg2png-wasm/svg2png_wasm_bg.wasm';

initialize(wasm).catch(() => {});

let app = new Hono();

// For quick testing
app.get('/circle', async () => {
    const svgtext = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>`;
    const buf = await svg2png(svgtext, {});
    return new Response(buf, { headers: { 'content-type': 'image/png' } });
});

// The old api, deprecated, don't use except for backwards compatibility
app.post('/', async (c) => {
    const contentType = c.req.header('content-type') || '';
    if (!contentType.includes('image/svg+xml')) {
        return c.text('bad request content-type', 400);
    }
    const svg = await c.req.text();
    const buf = await svg2png(svg, {});
    return new Response(buf, { headers: { 'content-type': 'image/png' } });
});

// Take a POST request with svg in the 'svg' field and optional svg2png-wasm params
app.post('/png', async (c) => {
    const body = await c.req.parseBody();
    if (!body['svg']) {
        return c.text('bad request', 400);
    }
    const svg = body['svg'];
    const opts = ['width', 'height', 'scale', 'backgroundColor'].reduce((acc, key) => {
        if (body[key]) {
            acc[key] = body[key];
        }
        return acc;
    }, {});

    const buf = await svg2png(svg, opts);
    return new Response(buf, { headers: { 'content-type': 'image/png' } });
});

// Optional subpath
app = app.route('/svg2png', app);

export default app;
