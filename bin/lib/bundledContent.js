import { existsSync } from "node:fs";
import path from "node:path";

export const WINDOWS_BUNDLED_CONTENT_DIR = "bundled-content";

/** @param {string} backendRoot */
export function getBundledContentRoot(backendRoot) {
  // Windows updates can leave the old top-level problems/ and courses/ on disk.
  const packaged = path.join(backendRoot, WINDOWS_BUNDLED_CONTENT_DIR);
  return existsSync(packaged) ? packaged : backendRoot;
}
