#!/usr/bin/env node
import { runStdio } from "./transports/stdio.js";
import { runHttp } from "./transports/http.js";

interface CliOptions {
  http: boolean;
  port: number;
  host: string;
}

function parseArgs(argv: string[]): CliOptions {
  const args = argv.slice(2);
  const flagValue = (flag: string, fallback: string): string => {
    const i = args.indexOf(flag);
    return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
  };
  return {
    http: args.includes("--http"),
    port: Number(flagValue("--port", process.env.PORT ?? "3017")),
    host: flagValue("--host", "127.0.0.1"),
  };
}

async function main(): Promise<void> {
  const { http, port, host } = parseArgs(process.argv);
  if (http) await runHttp({ port, host });
  else await runStdio();
}

main().catch((err) => {
  console.error("designer-skill-mcp fatal:", err);
  process.exit(1);
});
