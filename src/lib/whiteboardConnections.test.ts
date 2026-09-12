import { describe, expect, it } from 'vitest';
import { connectionPoint, connectorVertices, connectorRoute, connectorMidpoint, resolveConnections, snapConnection } from './whiteboardConnections';

const shape = (id: string, x: number, type = 'rectangle') => ({ id, type, x, y: 0, width: 100, height: 100 });
const line = {
	id: 'line', type: 'arrow', x: 100, y: 50, width: 200, height: 0,
	startConnection: { elementId: 'a' }, endConnection: { elementId: 'b' }
};

describe('whiteboard connections', () => {
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
