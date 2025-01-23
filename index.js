const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "http://192.168.5.101:6556",
    changeOrigin: true,
    pathRewrite: { "^/proxy": "" },
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

app.listen(3000, () => {
  console.log("Proxy server running on http://localhost:3000");
});
