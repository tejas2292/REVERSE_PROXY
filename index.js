const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Target HLS stream base URL
const TARGET_URL = "http://192.168.5.101:8080";

// Full stream path to be appended dynamically
const STREAM_PATH =
  "/M2rFI2E6lenqfJh37RhpmsrAbqGmoW/hls/uqA6zx9tfq/CarPark/s.m3u8";

// Proxy middleware to forward requests to the correct stream URL
app.use(
  "/stream",
  createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      console.log(`Incoming request path: ${path}`);
      return STREAM_PATH; // Ensuring full HLS stream path is proxied
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying request to: ${TARGET_URL}${STREAM_PATH}`);
    },
    onProxyRes(proxyRes, req, res) {
      console.log(`Proxied response status: ${proxyRes.statusCode}`);
      proxyRes.headers["Access-Control-Allow-Origin"] = "*"; // Allow CORS
    },
    onError(err, req, res) {
      console.error("Proxy error:", err);
      res.status(500).send("Unable to fetch the stream.");
    },
  })
);

// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `Reverse Proxy Server running at http://localhost:${PORT}/stream`
  );
});
