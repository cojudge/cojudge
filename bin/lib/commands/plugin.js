import {
  fetchCatalog,
  getPluginsDir,
  install,
  listInstalled,
  setEnabled,
  uninstall,
  upgrade,
} from "../plugins.js";

const USAGE = `Usage:
  cojudge plugin list                 List installed plugins
  cojudge plugin search [keyword]     Browse the plugin catalog
  cojudge plugin install <source>     Install from owner/repo[@ref], a GitHub URL, a catalog id, or a local path
  cojudge plugin uninstall <id>       Remove a plugin
  cojudge plugin enable <id>          Enable a plugin
  cojudge plugin disable <id>         Disable a plugin (keeps files)
  cojudge plugin upgrade [id]         Re-install from source (all plugins if no id)`;

function printInstalled() {
  const list = listInstalled();
  console.log(`Plugins: ${getPluginsDir()}`);
  if (list.length === 0) {
    console.log("  (none installed) — try: cojudge plugin search");
    return;
  }
  for (const p of list) {
    const state = p.enabled ? "enabled " : "disabled";
    console.log(`  [${state}] ${p.id}@${p.version}  ${p.name}${p.source ? `  (${p.source})` : ""}`);
  }
}

/** A bare id (no slash, not a path) is looked up in the catalog. */
async function resolveInstallSource(src) {
  if (/^[a-z0-9][a-z0-9-]*$/.test(src)) {
    const hit = (await fetchCatalog()).find((e) => e.id === src);
    if (!hit) throw new Error(`No plugin '${src}' in the catalog`);
    return hit.source;
  }
  return src;
}

function restartHint() {
  console.log("Refresh the browser to see the change (no restart needed).");
}

export async function handlePlugin(args) {
  const [sub, arg] = [args[1], args[2]];
  try {
    switch (sub) {
      case undefined:
      case "list":
      case "ls":
        printInstalled();
        return;
      case "search": {
        const kw = (arg || "").toLowerCase();
        const installed = new Map(listInstalled().map((p) => [p.id, p]));
        const hits = (await fetchCatalog()).filter(
          (e) => !kw || `${e.id} ${e.name} ${e.description}`.toLowerCase().includes(kw),
        );
        if (hits.length === 0) console.log("No plugins found.");
        for (const e of hits) {
          const mine = installed.get(e.id);
          const tag = mine ? ` [installed ${mine.version}${mine.enabled ? "" : ", disabled"}]` : "";
          console.log(`  ${e.id}${e.version ? `@${e.version}` : ""}${tag}\n      ${e.name} — ${e.description}\n      source: ${e.source}`);
        }
        return;
      }
      case "install":
      case "add": {
        if (!arg) throw new Error("Specify a source, e.g. cojudge plugin install cojudge/leetcode-1000");
        const source = await resolveInstallSource(arg);
        const p = await install(source, { log: console.log });
        console.log(`Installed ${p.id}@${p.version} (${p.enabled ? "enabled" : "disabled"}).`);
        restartHint();
        return;
      }
      case "uninstall":
      case "remove":
      case "rm":
        if (!arg) throw new Error("Specify a plugin id");
        uninstall(arg);
        console.log(`Uninstalled ${arg}.`);
        restartHint();
        return;
      case "enable":
      case "disable":
        if (!arg) throw new Error("Specify a plugin id");
        setEnabled(arg, sub === "enable");
        console.log(`${sub === "enable" ? "Enabled" : "Disabled"} ${arg}.`);
        restartHint();
        return;
      case "upgrade":
      case "update": {
        const ids = arg ? [arg] : listInstalled().map((p) => p.id);
        for (const id of ids) {
          const p = await upgrade(id, { log: console.log });
          console.log(`Upgraded ${p.id} to ${p.version}.`);
        }
        return;
      }
      default:
        console.log(USAGE);
        if (sub !== "help" && sub !== "-h" && sub !== "--help") process.exitCode = 1;
    }
  } catch (e) {
    console.error(`Error: ${e.message}`);
    process.exitCode = 1;
  }
}
