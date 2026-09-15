import { describe, expect, it } from 'vitest';
import { connectionPoint, connectorVertices, connectorRoute, connectorMidpoint, resolveConnections, snapConnection, sanitizeConnection } from './whiteboardConnections';

const shape = (id: string, x: number, type = 'rectangle') => ({ id, type, x, y: 0, width: 100, height: 100 });
const line = {
	id: 'line', type: 'arrow', x: 100, y: 50, width: 200, height: 0,
	startConnection: { elementId: 'a' }, endConnection: { elementId: 'b' }
};

describe('whiteboard connections', () => {
	it.each([{ x: 20, y: 0 }, { x: 100, y: 30 }, { x: 75, y: 100 }, { x: 0, y: 65 }])('attaches at the chosen rectangle edge position %j regardless of the other endpoint', (point) => {
		const target = shape('a', 0);
		const connection = snapConnection(point, [target], 16);
		const arrow = { ...line, startConnection: connection, endConnection: undefined };
		const resolved = resolveConnections([target, arrow]);
		expect(connectorVertices(resolved[1])[0]).toEqual(point);
		const rerouted = resolveConnections([target, { ...arrow, width: -300, height: 400, points: [{ x: 50, y: -200 }] }]);
		expect(connectorVertices(rerouted[1])[0]).toEqual(point);
	});

	it('preserves the position along an edge when snapping nearby and follows translation, resize, and rotation', () => {
		const target = shape('a', 0);
		const connection = snapConnection({ x: 25, y: -6 }, [target], 8);
		expect(connection).toEqual({ elementId: 'a', anchor: { x: -0.5, y: -1 } });
		const arrow = { ...line, startConnection: connection, endConnection: undefined };
		const resized = { ...target, x: 200, y: 100, width: 200, height: 80, rotation: 90 };
		const result = resolveConnections([resized, arrow]);
		const start = connectorVertices(result[1])[0];
		expect(start.x).toBeCloseTo(340);
		expect(start.y).toBeCloseTo(90);
		expect(resolveConnections(result)).toBe(result);
	});

	it.each(['ellipse', 'diamond'])('preserves an arbitrary attachment on a %s outline', (type) => {
		const target = { ...shape('a', 0, type), width: -100, rotation: 30 };
		const point = connectionPoint(target, { x: -120, y: -30 });
		const connection = snapConnection(point, [target], 8);
		const result = resolveConnections([target, { ...line, endConnection: connection, startConnection: undefined }]);
		const end = connectorVertices(result[1]).at(-1)!;
		expect(end.x).toBeCloseTo(point.x);
		expect(end.y).toBeCloseTo(point.y);
	});

	it('retains saved anchors and safely falls back for old or malformed connections', () => {
		expect(sanitizeConnection({ elementId: 'a', anchor: { x: 0.3, y: -1 } })).toEqual({ elementId: 'a', anchor: { x: 0.3, y: -1 } });
		for (const anchor of [undefined, { x: NaN, y: 1 }, { x: 2, y: -1 }, { x: 0, y: 0 }]) {
			expect(sanitizeConnection({ elementId: 'a', anchor })).toEqual({ elementId: 'a' });
		}
		expect(sanitizeConnection({ elementId: 1 })).toBeUndefined();
	});

	it('keeps normal lines fixed even when legacy connection targets move', () => {
		const normalLine = { ...line, type: 'line' };
		const elements = [shape('a', 200), { ...shape('b', 600), y: 100 }, normalLine];
		expect(resolveConnections(elements)).toBe(elements);
		expect(connectorVertices(normalLine)).toEqual([{ x: 100, y: 50 }, { x: 300, y: 50 }]);
	});

	it('routes via a bend and attaches according to the first and last segment directions', () => {
		const routed = { ...line, points: [{ x: -50, y: 200 }] };
		const result = resolveConnections([shape('a', 0), { ...shape('b', 300), y: 200 }, routed]);
		expect(connectorVertices(result[2])).toEqual([{ x: 50, y: 100 }, { x: 50, y: 250 }, { x: 300, y: 250 }]);
		const moved = resolveConnections(result.map((element) => element.id === 'a' ? { ...element, x: 100 } : element));
		expect(connectorVertices(moved[2])[1]).toEqual({ x: 50, y: 250 });
		expect(resolveConnections(moved)).toBe(moved);
	});

	it('rounds bends and places labels halfway along the actual route', () => {
		const routed = { id: 'route', type: 'line', x: 0, y: 0, width: 300, height: 100, points: [{ x: 0, y: 100 }] };
		const route = connectorRoute(routed);
		expect(route.path).toBe('M 0 0 L 0 76 Q 0 100 24 100 L 300 100');
		expect(route.hitPoints).toContainEqual({ x: 6, y: 94 });
		const label = connectorMidpoint(routed);
		expect(label.y).toBe(100);
		expect(label.x).toBeGreaterThan(100);
		expect(label.x).toBeLessThan(110);
		expect(connectorMidpoint({ ...routed, width: 0, height: 0, points: [{ x: 0, y: 0 }] })).toEqual({ x: 0, y: 0 });
	});

	it('follows moved and resized shapes while keeping both endpoints on their outlines', () => {
		const result = resolveConnections([shape('a', 0), { ...shape('b', 300), y: 100, width: 200 }, line]);
		const connector = result[2];
		expect(connector.x).toBeCloseTo(100);
		expect(connector.y).toBeCloseTo(50 + 100 / 7);
		expect(connector.x + connector.width).toBeCloseTo(300);
		expect(connector.y + connector.height).toBeCloseTo(150 - 200 / 7);
		expect(resolveConnections(result)).toBe(result);
	});

	it('uses ellipse and diamond outlines rather than bounding boxes', () => {
		const circle = connectionPoint(shape('circle', 0, 'ellipse'), { x: 200, y: 200 });
		expect(circle.x).toBeCloseTo(50 + 50 / Math.sqrt(2));
		expect(circle.y).toBeCloseTo(circle.x);
		expect(connectionPoint(shape('diamond', 0, 'diamond'), { x: 200, y: 200 })).toEqual({ x: 75, y: 75 });
	});

	it('handles rotation and shapes drawn with negative dimensions', () => {
		const rotated = { ...shape('a', 0), height: 40, rotation: 90 };
		expect(connectionPoint(rotated, { x: 500, y: 20 }).x).toBeCloseTo(70);
		expect(connectionPoint({ ...shape('a', 100), width: -100 }, { x: 300, y: 50 })).toEqual({ x: 100, y: 50 });
	});

	it('snaps inside shapes and near edges but not in empty curved corners', () => {
		const circle = shape('a', 0, 'ellipse');
		expect(snapConnection({ x: 50, y: 50 }, [circle], 8)?.elementId).toBe('a');
		expect(snapConnection({ x: 106, y: 50 }, [circle], 8)?.elementId).toBe('a');
		expect(snapConnection({ x: 106, y: 50 }, [circle], 4)).toBeUndefined();
		expect(snapConnection({ x: 0, y: 0 }, [circle], 8)).toBeUndefined();
		expect(snapConnection({ x: 50, y: 50 }, [circle, shape('b', 0)], 8)?.elementId).toBe('b');
	});

	it('preserves the free endpoint and detaches deleted targets without jumping', () => {
		const initial = resolveConnections([shape('a', 0), shape('b', 300), line]);
		const result = resolveConnections(initial.filter((element) => element.id !== 'b'));
		const connector = result.find((element) => element.id === 'line')!;
		expect(connector).toMatchObject({ x: 100, y: 50, width: 200, height: 0, endConnection: undefined });
		const moved = resolveConnections(result.map((element) => element.id === 'a' ? { ...element, y: 100 } : element));
		const movedLine = moved.find((element) => element.id === 'line')!;
		expect(movedLine.x + movedLine.width).toBeCloseTo(300);
		expect(movedLine.y + movedLine.height).toBeCloseTo(50);
	});
});
