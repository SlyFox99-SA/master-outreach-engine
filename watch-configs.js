import { watch, readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
const dataDir = "./data";
function regen() {
  const files = readdirSync(dataDir).filter(function(f){ return f.startsWith("config-") && f.endsWith(".json"); });
  const lines = ["window.__CONFIGS = {"];
  let first = true;
  for (const file of files) {
    if (!first) lines[lines.length - 1] += ",";
    const name = file.replace("config-", "").replace(".json", "");
    const content = readFileSync(join(dataDir, file), "utf-8").replace(/^\uFEFF/, "").trim();
    lines.push("  " + JSON.stringify(name) + ": " + content);
    first = false;
  }
  const active = readFileSync(join(dataDir, "active-config.json"), "utf-8").replace(/^\uFEFF/, "").trim();
  lines[lines.length - 1] += ",";
  lines.push("  \"active\": " + active);
  lines.push("};");
  writeFileSync("configs.js", lines.join("\n"));
  console.log("[watch-configs] regenerated", new Date().toLocaleTimeString());
}
regen();
watch(dataDir, { persistent: true }, function(event, filename){ if (filename && filename.startsWith("config-") && filename.endsWith(".json")) setTimeout(regen, 300); });
console.log("[watch-configs] watching data/*.json");
