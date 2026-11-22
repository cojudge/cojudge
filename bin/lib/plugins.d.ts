export interface PluginManifest {
	id: string;
	name: string;
	version: string;
	description: string;
	minCojudge?: string;
	homepage?: string;
}
export interface InstalledPlugin extends PluginManifest {
	dir: string;
	source: string;
	enabled: boolean;
	installedAt: number;
}
export interface EnabledPlugin {
	id: string;
	problems: string;
	courses: string;
	unprefixed: boolean;
}
export interface CatalogEntry {
	id: string;
	name: string;
	description: string;
	source: string;
	version: string;
	problems?: number;
}
export interface IdOpts {
	userProblemsDir: string;
	bundledProblemsDir: string;
	plugins?: EnabledPlugin[];
}
export const MANIFEST: string;
export const STATE: string;
export const DEFAULT_INDEX_URL: string;
export function getPluginsDir(): string;
export function validId(id: unknown): boolean;
export function validateManifest(m: unknown): PluginManifest;
export function listInstalled(): InstalledPlugin[];
export function getInstalled(id: string): InstalledPlugin | null;
export function setEnabled(id: string, enabled: boolean): InstalledPlugin;
export function uninstall(id: string): { id: string };
export function install(src: string, opts?: { log?: (msg: string) => void }): Promise<InstalledPlugin>;
export function upgrade(id: string, opts?: { log?: (msg: string) => void }): Promise<InstalledPlugin>;
export function fetchCatalog(): Promise<CatalogEntry[]>;
export function isValidSlug(s: unknown): boolean;
export function parseProblemId(id: unknown): { pluginId: string | null; slug: string } | null;
export function enabledPlugins(): EnabledPlugin[];
export function problemDirCandidates(id: string, opts: IdOpts): { user: string; bases: string[] } | null;
export function listProblemIds(opts: IdOpts): string[];
export function findProblemIdsBySlug(slug: string, opts: IdOpts): string[];
export function qualifyCourseEntry(entry: string, plugin: EnabledPlugin | null): string;
export function pluginForCourse(courseId: string, plugins?: EnabledPlugin[]): EnabledPlugin | null;
