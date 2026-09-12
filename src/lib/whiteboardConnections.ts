export type Connection = { elementId: string };
type Point = { x: number; y: number };
type Element = {
	id: string;
	type: string;
	x: number;
	y: number;
	width: number;
	height: number;
	rotation?: number;
	/** Interior bend points, relative to the connector's start. */
	points?: Point[];
	startConnection?: Connection;
	endConnection?: Connection;
};

export function isConnector(element: Element): boolean {
	return element.type === 'line' || element.type === 'arrow';
}

export function canConnect(element: Element): boolean {
	return ['rectangle', 'ellipse', 'diamond', 'text', 'image'].includes(element.type);
}

function center(element: Element): Point {
	return { x: element.x + element.width / 2, y: element.y + element.height / 2 };
}

function rotate(point: Point, origin: Point, degrees: number): Point {
	const angle = degrees * Math.PI / 180;
	const dx = point.x - origin.x;
	const dy = point.y - origin.y;
	return {
		x: origin.x + dx * Math.cos(angle) - dy * Math.sin(angle),
		y: origin.y + dx * Math.sin(angle) + dy * Math.cos(angle)
	};
}

/** Intersect a ray from the center with the actual (possibly rotated) shape outline. */
export function connectionPoint(element: Element, toward: Point): Point {
	const origin = center(element);
	const local = rotate(toward, origin, -(element.rotation ?? 0));
	let dx = local.x - origin.x;
	const dy = local.y - origin.y;
	if (Math.abs(dx) + Math.abs(dy) < 1e-8) dx = 1;
	const rx = Math.max(0.5, Math.abs(element.width) / 2);
	const ry = Math.max(0.5, Math.abs(element.height) / 2);
	const divisor = element.type === 'ellipse'
		? Math.hypot(dx / rx, dy / ry)
		: element.type === 'diamond'
			? Math.abs(dx / rx) + Math.abs(dy / ry)
			: Math.max(Math.abs(dx / rx), Math.abs(dy / ry));
	return rotate({ x: origin.x + dx / divisor, y: origin.y + dy / divisor }, origin, element.rotation ?? 0);
}

export function connectorEndpoints(element: Element): { start: Point; end: Point } {
	const origin = center(element);
	return {
		start: rotate({ x: element.x, y: element.y }, origin, element.rotation ?? 0),
		end: rotate({ x: element.x + element.width, y: element.y + element.height }, origin, element.rotation ?? 0)
	};
}

export function connectorVertices(element: Element): Point[] {
	const { start, end } = connectorEndpoints(element);
	return [start, ...(element.points ?? []).map((point) =>
		rotate({ x: element.x + point.x, y: element.y + point.y }, center(element), element.rotation ?? 0)), end];
}

/** Use the same rounded route for rendering and pointer hit testing. */
export function connectorRoute(element: Element): { path: string; hitPoints: Point[] } {
	const vertices = connectorVertices(element);
	const hitPoints = [vertices[0]];
	let path = `M ${vertices[0].x} ${vertices[0].y}`;
	for (let index = 1; index < vertices.length - 1; index += 1) {
		const previous = vertices[index - 1];
		const corner = vertices[index];
		const next = vertices[index + 1];
		const incoming = Math.hypot(corner.x - previous.x, corner.y - previous.y);
		const outgoing = Math.hypot(next.x - corner.x, next.y - corner.y);
		const radius = Math.min(24, incoming / 4, outgoing / 4);
		const entry = { x: corner.x + (previous.x - corner.x) * radius / (incoming || 1), y: corner.y + (previous.y - corner.y) * radius / (incoming || 1) };
		const exit = { x: corner.x + (next.x - corner.x) * radius / (outgoing || 1), y: corner.y + (next.y - corner.y) * radius / (outgoing || 1) };
		path += ` L ${entry.x} ${entry.y} Q ${corner.x} ${corner.y} ${exit.x} ${exit.y}`;
		hitPoints.push(entry);
		for (let step = 1; step <= 8; step += 1) {
			const t = step / 8;
			hitPoints.push({ x: (1 - t) ** 2 * entry.x + 2 * (1 - t) * t * corner.x + t ** 2 * exit.x,
				y: (1 - t) ** 2 * entry.y + 2 * (1 - t) * t * corner.y + t ** 2 * exit.y });
		}
	}
	const end = vertices.at(-1)!;
	path += ` L ${end.x} ${end.y}`;
	hitPoints.push(end);
	return { path, hitPoints };
}

export function connectorMidpoint(element: Element): Point {
	const points = connectorRoute(element).hitPoints;
	const lengths = points.slice(1).map((point, index) => Math.hypot(point.x - points[index].x, point.y - points[index].y));
	let remaining = lengths.reduce((sum, length) => sum + length, 0) / 2;
	for (let index = 0; index < lengths.length; index += 1) {
		if (remaining <= lengths[index]) {
			const t = lengths[index] ? remaining / lengths[index] : 0;
			return { x: points[index].x + (points[index + 1].x - points[index].x) * t,
				y: points[index].y + (points[index + 1].y - points[index].y) * t };
		}
		remaining -= lengths[index];
	}
	return points[0];
}

/** Prefer the topmost shape, allowing drops anywhere inside it or near its outline. */
export function snapConnection(point: Point, elements: Element[], tolerance: number, excludeId?: string): Connection | undefined {
	for (const element of elements.toReversed()) {
		if (element.id === excludeId || !canConnect(element)) continue;
		const origin = center(element);
		const local = rotate(point, origin, -(element.rotation ?? 0));
		const dx = Math.abs(local.x - origin.x) / Math.max(0.5, Math.abs(element.width) / 2);
		const dy = Math.abs(local.y - origin.y) / Math.max(0.5, Math.abs(element.height) / 2);
		const inside = element.type === 'ellipse' ? dx * dx + dy * dy <= 1
			: element.type === 'diamond' ? dx + dy <= 1 : Math.max(dx, dy) <= 1;
		const edge = connectionPoint(element, point);
		if (inside || Math.hypot(edge.x - point.x, edge.y - point.y) <= tolerance) {
			return { elementId: element.id };
		}
	}
	return undefined;
}

/** Keep endpoints on outlines as targets move/resize; missing targets leave a free endpoint. */
export function resolveConnections<T extends Element>(elements: T[]): T[] {
	const byId = new Map(elements.map((element) => [element.id, element]));
	let changed = false;
	const result = elements.map((element) => {
		if (!isConnector(element) || (!element.startConnection && !element.endConnection)) return element;
		const target = (connection?: Connection) => {
			const found = connection && byId.get(connection.elementId);
			return found && canConnect(found) ? found : undefined;
		};
		const startTarget = target(element.startConnection);
		const endTarget = target(element.endConnection);
		let { start, end } = connectorEndpoints(element);
		const bends = connectorVertices(element).slice(1, -1);
		const startToward = bends[0] ?? (endTarget ? center(endTarget) : end);
		const endToward = bends.at(-1) ?? (startTarget ? center(startTarget) : start);
		if (startTarget) start = connectionPoint(startTarget, startToward);
		if (endTarget) end = connectionPoint(endTarget, endToward);
		const width = end.x - start.x;
		const height = end.y - start.y;
		if ((!element.startConnection || startTarget) && (!element.endConnection || endTarget)
			&& !element.rotation && Math.abs(element.x - start.x) < 1e-8 && Math.abs(element.y - start.y) < 1e-8
			&& Math.abs(element.width - width) < 1e-8 && Math.abs(element.height - height) < 1e-8) return element;
		changed = true;
		return { ...element, x: start.x, y: start.y, width, height, rotation: 0,
			points: element.points ? bends.map((point) => ({ x: point.x - start.x, y: point.y - start.y })) : undefined,
			startConnection: startTarget ? element.startConnection : undefined,
			endConnection: endTarget ? element.endConnection : undefined };
	});
	return changed ? result : elements;
}
