#!/usr/bin/env node
import { HELP_TEXT, parseCli } from "./cli.js";
import { pkg } from "./pkg.js";
import { runHttp } from "./transports/http.js";
import { runStdio } from "./transports/stdio.js";
import { notifyAvailableUpdate, printCheckUpdate } from "./update-check.js";

async function main(): Promise<void> {
  const command = parseCli(process.argv);

  switch (command.kind) {
    case "help":
      console.log(HELP_TEXT.trimEnd());
      return;
    case "version":
      console.log(pkg.version);
      return;
    case "check-update":
      await printCheckUpdate();
      return;
    case "run":
      if (command.notifyUpdates) notifyAvailableUpdate();
      if (command.http) await runHttp({ port: command.port, host: command.host });
      else await runStdio();
  }
}

main().catch((err) => {
  console.error("designer-skill-mcp fatal:", err);
  process.exit(1);
});
