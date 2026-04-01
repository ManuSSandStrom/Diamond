const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const clientRoot = path.resolve(__dirname, "..", "client");
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".vcf": "text/vcard; charset=utf-8",
  ".webm": "video/webm"
};

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || "application/octet-stream";

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Unable to read the requested file.");
      return;
    }

    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  });
}

function resolveRequestPath(urlPathname) {
  const normalized = decodeURIComponent(urlPathname.split("?")[0]);
  const requestedPath = normalized === "/" ? "/index.html" : normalized;
  return path.normalize(path.join(clientRoot, requestedPath));
}

const server = http.createServer((request, response) => {
  const requestPath = resolveRequestPath(request.url || "/");

  if (!requestPath.startsWith(clientRoot)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  fs.stat(requestPath, (error, stats) => {
    if (!error && stats.isFile()) {
      sendFile(response, requestPath);
      return;
    }

    const fallback = path.join(clientRoot, "index.html");
    sendFile(response, fallback);
  });
});

server.listen(port, () => {
  console.log(`Profile server running at http://localhost:${port}`);
});
