import { describe, expect, it } from 'vitest';
import { applyCourseOrder, moveCourse, parseCourseOrder } from './courseOrder';

const c = (...ids: string[]) => ids.map((id) => ({ id }));
const ids = (list: { id: string }[]) => list.map((x) => x.id);

describe('courseOrder', () => {
	it('keeps the default order when nothing is saved', () => {
		expect(ids(applyCourseOrder(c('a', 'b', 'c'), []))).toEqual(['a', 'b', 'c']);
	});

	it('applies the saved order, skips removed ids, appends new courses', () => {
		expect(ids(applyCourseOrder(c('blind75', 'nc150', 'nc250', 'basic50'), ['basic50', 'gone', 'nc250']))).toEqual([
			'basic50',
			'nc250',
			'blind75',
			'nc150'
		]);
	});

	it('moves a course before or after a target', () => {
		expect(moveCourse(['a', 'b', 'c', 'd'], 'd', 'a', true)).toEqual(['d', 'a', 'b', 'c']);
		expect(moveCourse(['a', 'b', 'c', 'd'], 'a', 'c', false)).toEqual(['b', 'c', 'a', 'd']);
		expect(moveCourse(['a', 'b'], 'a', 'a', true)).toEqual(['a', 'b']);
		expect(moveCourse(['a', 'b'], 'x', 'a', true)).toEqual(['a', 'b']);
	});

	it('treats malformed storage as no saved order', () => {
		expect(parseCourseOrder(null)).toEqual([]);
		expect(parseCourseOrder('{bad')).toEqual([]);
		expect(parseCourseOrder('{"a":1}')).toEqual([]);
		expect(parseCourseOrder('["a",2,"b"]')).toEqual(['a', 'b']);
	});
});
