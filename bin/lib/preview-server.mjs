import { createServer } from "node:http";
import { resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const port = Number(process.env.PORT || 5375);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT is invalid");
}

const origin = `http://localhost:${port}`;
let handler;
let shuttingDown = false;

const server = createServer((request, response) => {
  if (!handler) {
    response.writeHead(503, { connection: "close", "content-type": "text/plain" });
    response.end("Service Unavailable");
    return;
  }

  try {
    Promise.resolve(handler(request, response)).catch((error) => {
      console.error(error);
      if (response.headersSent) response.destroy(error);
      else response.writeHead(500).end("Internal Server Error");
    });
  } catch (error) {
    console.error(error);
    if (response.headersSent) response.destroy(error);
    else response.writeHead(500).end("Internal Server Error");
  }
});

async function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  const fallback = setTimeout(() => process.exit(exitCode), 10000);
  fallback.unref();
  server.close();
  server.closeAllConnections();
  try {
    await globalThis.__cojudgeShutdown?.();
  } catch (error) {
    console.error("Backend cleanup failed:", error);
  }
  process.exit(exitCode);
}

process.on("SIGINT", () => void shutdown(130));
process.on("SIGTERM", () => void shutdown(143));

async function main() {
  await new Promise((resolveListen, rejectListen) => {
    const onError = (error) => rejectListen(error);
    server.once("error", onError);
    server.listen(port, () => {
      server.off("error", onError);
      resolveListen();
    });
  });

  process.env.ORIGIN = origin;
  process.env.BODY_SIZE_LIMIT = "10M";
  delete process.env.PROTOCOL_HEADER;
  delete process.env.HOST_HEADER;
  delete process.env.PORT_HEADER;

  ({ handler } = await import(pathToFileURL(resolve("build/handler.js")).href));
  if (shuttingDown) return;

  server.on("error", (error) => {
    console.error(error);
    void shutdown(1);
  });
  console.log(`Listening on ${origin}`);
}

main().catch((error) => {
  console.error(error);
  void shutdown(1);
});
