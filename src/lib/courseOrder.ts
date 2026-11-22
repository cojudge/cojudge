/** localStorage key for the user's course-tab order (array of course ids). */
export const COURSE_ORDER_STORAGE_KEY = 'course-tab-order';

/**
 * Order courses by the user's saved id list. Saved ids that no longer exist
 * (e.g. an uninstalled pack) are skipped; courses missing from the saved list
 * (e.g. a newly installed pack) keep their default relative order at the end.
 */
export function applyCourseOrder<T extends { id: string }>(courses: T[], savedOrder: string[]): T[] {
	if (savedOrder.length === 0) return courses;
	const rank = new Map(savedOrder.map((id, i) => [id, i]));
	const known = courses.filter((c) => rank.has(c.id)).sort((a, b) => rank.get(a.id)! - rank.get(b.id)!);
	const rest = courses.filter((c) => !rank.has(c.id));
	return [...known, ...rest];
}

/**
 * Move `draggedId` to where `targetId` is, placing it before the target when
 * `before` is true, after it otherwise. Returns the new id order.
 */
export function moveCourse(ids: string[], draggedId: string, targetId: string, before: boolean): string[] {
	if (draggedId === targetId || !ids.includes(draggedId) || !ids.includes(targetId)) return ids;
	const without = ids.filter((id) => id !== draggedId);
	const at = without.indexOf(targetId) + (before ? 0 : 1);
	return [...without.slice(0, at), draggedId, ...without.slice(at)];
}

/** Read the saved order; anything malformed counts as "no saved order". */
export function parseCourseOrder(raw: string | null): string[] {
	if (!raw) return [];
	try {
		const value: unknown = JSON.parse(raw);
		return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : [];
	} catch {
		return [];
	}
}
