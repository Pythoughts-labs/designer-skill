import { describe, it, expect, beforeAll } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../src/server.js";
import { dispatchIntent } from "../src/dispatch.js";
import { REFERENCE_NAMES } from "../src/skill.js";

async function connectClient(): Promise<Client> {
  const server = createServer();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test-client", version: "0.0.0" });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return client;
}

function textOf(result: { content: Array<{ type: string; text?: string }> }): string {
  return result.content
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("\n");
}

describe("dispatchIntent", () => {
  it("routes 'make it pop' to bolder", () => {
    expect(dispatchIntent("the hero is bland, make it pop").matched.map((m) => m.verb)).toContain("bolder");
  });
  it("routes 'production-ready' to harden", () => {
    expect(
      dispatchIntent("make this production-ready with real data and error states").matched.map((m) => m.verb),
    ).toContain("harden");
  });
  it("routes 'spacing feels off' to layout", () => {
    expect(dispatchIntent("the spacing feels off on this card").matched.map((m) => m.verb)).toContain("layout");
  });
  it("routes 'redesign without breaking' to redesign", () => {
    expect(dispatchIntent("redesign this page without breaking it").matched.map((m) => m.verb)).toContain("redesign");
  });
  it("always recommends the anti-slop ship gate", () => {
    expect(dispatchIntent("literally anything").recommendedReads).toContain("avoid-ai-slop");
    expect(dispatchIntent("make it pop").recommendedReads).toContain("avoid-ai-slop");
  });
  it("falls back to the command playbook when nothing matches", () => {
    const r = dispatchIntent("xyzzy");
    expect(r.matched).toHaveLength(0);
    expect(r.recommendedReads).toContain("command-playbook");
  });
});

describe("designer-skill MCP server", () => {
  let client: Client;
  beforeAll(async () => {
    client = await connectClient();
  });

  it("advertises the five tools", async () => {
    const names = (await client.listTools()).tools.map((t) => t.name).sort();
    expect(names).toEqual(
      ["anti_slop_checklist", "apply_designer", "dispatch_intent", "get_design_system", "get_reference"].sort(),
    );
  });

  it("get_design_system returns the router with the precedence rule", async () => {
    const text = textOf(await client.callTool({ name: "get_design_system" }));
    expect(text).toContain("designer-skill");
    expect(text.toLowerCase()).toContain("precedence");
    expect(text).toContain("reference/avoid-ai-slop.md");
  });

  it("get_reference returns concrete values for a named file", async () => {
    const text = textOf(await client.callTool({ name: "get_reference", arguments: { name: "motion-and-interaction" } }));
    expect(text).toContain("cubic-bezier");
  });

  it("get_reference rejects an unknown name", async () => {
    const res = await client.callTool({ name: "get_reference", arguments: { name: "not-a-real-file" } });
    expect(res.isError).toBe(true);
  });

  it("dispatch_intent returns routed guidance text", async () => {
    const text = textOf(await client.callTool({ name: "dispatch_intent", arguments: { request: "make it pop" } }));
    expect(text).toContain("bolder");
    expect(text).toContain("avoid-ai-slop.md");
  });

  it("anti_slop_checklist returns the slop reference", async () => {
    const text = textOf(await client.callTool({ name: "anti_slop_checklist" }));
    expect(text).toContain("Avoiding AI Slop");
  });

  it("apply_designer errors clearly when no API key is set", async () => {
    const prev = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    try {
      const res = await client.callTool({ name: "apply_designer", arguments: { request: "build a pricing page" } });
      expect(res.isError).toBe(true);
      expect(textOf(res as { content: Array<{ type: string; text?: string }> })).toContain("ANTHROPIC_API_KEY");
    } finally {
      if (prev !== undefined) process.env.ANTHROPIC_API_KEY = prev;
    }
  });

  it("exposes the skill router resource and all seven reference resources", async () => {
    const uris = (await client.listResources()).resources.map((r) => r.uri);
    expect(uris).toContain("designer://skill");
    for (const name of REFERENCE_NAMES) {
      expect(uris).toContain(`designer://reference/${name}`);
    }
  });

  it("reads a reference resource by URI", async () => {
    const res = await client.readResource({ uri: "designer://reference/avoid-ai-slop" });
    expect(res.contents[0]?.text).toContain("Avoiding AI Slop");
  });

  it("exposes the design prompt and bundles skill context", async () => {
    const names = (await client.listPrompts()).prompts.map((p) => p.name);
    expect(names).toContain("design");
    const prompt = await client.getPrompt({ name: "design", arguments: { task: "build a pricing page" } });
    const msg = prompt.messages[0];
    const text = typeof msg.content === "object" && "text" in msg.content ? (msg.content.text as string) : "";
    expect(text).toContain("designer-skill");
    expect(text).toContain("Task: build a pricing page");
  });
});
