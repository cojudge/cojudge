<script lang="ts">
	import WhiteboardIcon from '$lib/components/WhiteboardIcon.svelte';
	import { showConfirm } from '$lib/dialogs';
	import userSettingsStorage from '$lib/stores/userSettingsStorage';
	import { onMount, tick } from 'svelte';

	type Tool =
		| 'hand'
		| 'selection'
		| 'rectangle'
		| 'diamond'
		| 'ellipse'
		| 'arrow'
		| 'line'
		| 'draw'
		| 'text'
		| 'image'
		| 'eraser';
	type ElementType = Exclude<Tool, 'hand' | 'selection' | 'eraser'>;
	type StrokeStyle = 'solid' | 'dashed' | 'dotted';
	type ResizeHandle = 'nw' | 'ne' | 'se' | 'sw';

	type Point = { x: number; y: number };
	type Bounds = { x: number; y: number; width: number; height: number };

	type BoardElement = {
		id: string;
		type: ElementType;
		x: number;
		y: number;
		width: number;
		height: number;
		points?: Point[];
		text?: string;
		imageData?: string;
		stroke: string;
		fill: string;
		strokeWidth: number;
		strokeStyle: StrokeStyle;
		opacity: number;
		fontSize: number;
	};

	type StyleState = Pick<
		BoardElement,
		'stroke' | 'fill' | 'strokeWidth' | 'strokeStyle' | 'opacity' | 'fontSize'
	>;

	type TextEditor = {
		elementId: string | null;
		x: number;
		y: number;
		value: string;
	};

	type Gesture =
		| {
				kind: 'pan';
				startClient: Point;
				startPan: Point;
		  }
		| {
				kind: 'draw';
				elementId: string;
				origin: Point;
				before: BoardElement[];
				moved: boolean;
		  }
		| {
				kind: 'move';
				start: Point;
				before: BoardElement[];
				originals: BoardElement[];
				moved: boolean;
		  }
		| {
				kind: 'resize';
				handle: ResizeHandle;
				before: BoardElement[];
				originals: BoardElement[];
				bounds: Bounds;
				moved: boolean;
		  }
		| {
				kind: 'marquee';
				start: Point;
				current: Point;
				baseSelection: string[];
		  }
		| {
				kind: 'erase';
				before: BoardElement[];
				changed: boolean;
		  };

	type StoredBoard = {
		version: 1;
		elements: BoardElement[];
		view?: { panX: number; panY: number; zoom: number };
		preferences?: { grid: boolean };
	};

	const STORAGE_KEY = 'cojudge-whiteboard-v1';
	const MIN_ZOOM = 0.1;
	const MAX_ZOOM = 4;
	const strokeColors = ['#1b1b1f', '#7048e8', '#1971c2', '#e03131', '#f08c00', '#2f9e44'];
	const fillColors = ['transparent', '#ffc9c9', '#d3f9d8', '#a5d8ff', '#ffec99', '#eebefa'];
	const drawableTools = new Set<Tool>([
		'rectangle',
		'diamond',
		'ellipse',
		'arrow',
		'line',
		'draw',
		'text'
	]);

	const tools: { id: Tool; label: string; icon: string; shortcut?: string }[] = [
		{ id: 'hand', label: 'Hand (H)', icon: 'hand' },
		{ id: 'selection', label: 'Selection (1 or V)', icon: 'selection', shortcut: '1' },
		{ id: 'rectangle', label: 'Rectangle (2 or R)', icon: 'rectangle', shortcut: '2' },
		{ id: 'diamond', label: 'Diamond (3 or D)', icon: 'diamond', shortcut: '3' },
		{ id: 'ellipse', label: 'Ellipse (4 or O)', icon: 'ellipse', shortcut: '4' },
		{ id: 'arrow', label: 'Arrow (5 or A)', icon: 'arrow', shortcut: '5' },
		{ id: 'line', label: 'Line (6 or L)', icon: 'line', shortcut: '6' },
		{ id: 'draw', label: 'Draw (7 or P)', icon: 'pencil', shortcut: '7' },
		{ id: 'text', label: 'Text (8 or T)', icon: 'text', shortcut: '8' },
		{ id: 'image', label: 'Insert image (9)', icon: 'image', shortcut: '9' },
		{ id: 'eraser', label: 'Eraser (0 or E)', icon: 'eraser', shortcut: '0' }
	];

	let canvasElement: SVGSVGElement | null = null;
	let elementsGroup: SVGGElement | null = null;
	let imageInput: HTMLInputElement | null = null;
	let boardInput: HTMLInputElement | null = null;
	let textArea: HTMLTextAreaElement | null = null;
	let textMeasureCanvas: HTMLCanvasElement | null = null;
	let boardRoot: HTMLElement | null = null;

	let elements: BoardElement[] = [];
	let selectedIds: string[] = [];
	let activeTool: Tool = 'selection';
	let toolLocked = false;
	let gesture: Gesture | null = null;
	let panX = 0;
	let panY = 0;
	let zoom = 1;
	let spacePressed = false;
	let textEditor: TextEditor | null = null;
	let undoStack: BoardElement[][] = [];
	let redoStack: BoardElement[][] = [];
	let clipboardElements: BoardElement[] = [];
	let mounted = false;
	let saveTimer: ReturnType<typeof setTimeout> | undefined;
	let toastTimer: ReturnType<typeof setTimeout> | undefined;
	let activeStorageKey = STORAGE_KEY;
	let saveState: 'saved' | 'saving' | 'error' = 'saved';
	let toastMessage = '';
	let accessibilityMessage = '';
	let copiedShareLink = false;
	let shareLink = '';
	let shareDialog: HTMLDivElement | null = null;
	let helpDialog: HTMLDivElement | null = null;
	let previouslyFocused: HTMLElement | null = null;

	let showMainMenu = false;
	let showOverflowMenu = false;
	let showLibrary = false;
	let showShare = false;
	let showHelp = false;
	let showGrid = false;
	let isDark = false;
	let hasInteracted = false;

	let drawingStyle: StyleState = {
		stroke: '#1b1b1f',
		fill: 'transparent',
		strokeWidth: 2,
		strokeStyle: 'solid',
		opacity: 100,
		fontSize: 24
	};

	let selectionBounds: Bounds | null = null;
	let selectedElement: BoardElement | undefined;
	$: selectedElement = elements.find((element) => selectedIds.includes(element.id));
	$: selectionBounds = getUnionBounds(elements.filter((element) => selectedIds.includes(element.id)));
	$: isDark = $userSettingsStorage.theme === 'dark';
	$: if (showShare) {
		elements;
		shareLink = createShareLink();
	}

	onMount(() => {
		const previousOverflow = document.body.style.overflow;
		const previousOverscrollBehavior = document.documentElement.style.overscrollBehavior;
		const wheelTarget = boardRoot;
		document.body.style.overflow = 'hidden';
		document.documentElement.style.overscrollBehavior = 'none';

		loadBoardFromLocation(true);

		mounted = true;
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('hashchange', handleHashChange);
		window.addEventListener('pagehide', saveBoardNow);
		window.addEventListener('paste', handlePaste);
		wheelTarget?.addEventListener('wheel', handleWheel, { capture: true, passive: false });
		document.addEventListener('pointerdown', closeMenusOnOutsideClick);

		return () => {
			saveBoardNow();
			document.body.style.overflow = previousOverflow;
			document.documentElement.style.overscrollBehavior = previousOverscrollBehavior;
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('hashchange', handleHashChange);
			window.removeEventListener('pagehide', saveBoardNow);
			window.removeEventListener('paste', handlePaste);
			wheelTarget?.removeEventListener('wheel', handleWheel, { capture: true });
			document.removeEventListener('pointerdown', closeMenusOnOutsideClick);
			if (toastTimer) clearTimeout(toastTimer);
		};
	});

	function createId(): string {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID();
		}
		return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
	}

	function clamp(value: number, minimum: number, maximum: number): number {
		return Math.min(maximum, Math.max(minimum, value));
	}

	function finiteNumber(value: unknown, fallback: number): number {
		return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
	}

	function storageKeyForShare(value: string): string {
		let hash = 2166136261;
		for (let index = 0; index < value.length; index += 1) {
			hash ^= value.charCodeAt(index);
			hash = Math.imul(hash, 16777619);
		}
		return `${STORAGE_KEY}:share:${(hash >>> 0).toString(36)}`;
	}

	function applyStoredBoard(stored: StoredBoard): void {
		elements = sanitizeElements(stored.elements);
		panX = finiteNumber(stored.view?.panX, 0);
		panY = finiteNumber(stored.view?.panY, 0);
		zoom = clamp(finiteNumber(stored.view?.zoom, 1), MIN_ZOOM, MAX_ZOOM);
		showGrid = typeof stored.preferences?.grid === 'boolean' ? stored.preferences.grid : false;
		selectedIds = [];
		undoStack = [];
		redoStack = [];
		textEditor = null;
		saveState = 'saved';
	}

	function loadBoardFromLocation(showFeedback = false): void {
		const sharedPayload = window.location.hash.startsWith('#board=')
			? window.location.hash.slice('#board='.length)
			: null;
		activeStorageKey = sharedPayload ? storageKeyForShare(sharedPayload) : STORAGE_KEY;

		try {
			const savedCopy = localStorage.getItem(activeStorageKey);
			if (savedCopy) {
				applyStoredBoard(JSON.parse(savedCopy) as StoredBoard);
				if (showFeedback && sharedPayload) showToast('Your edited copy of this shared board was restored');
				return;
			}

			if (sharedPayload) {
				applyStoredBoard(decodeBoard(sharedPayload));
				if (showFeedback) showToast('Shared whiteboard loaded');
			} else {
				applyStoredBoard({ version: 1, elements: [] });
			}
		} catch {
			localStorage.removeItem(activeStorageKey);
			applyStoredBoard({ version: 1, elements: [] });
			if (sharedPayload) showToast('This share link could not be opened');
		}
	}

	function handleHashChange(): void {
		saveBoardNow();
		loadBoardFromLocation(true);
	}

	function cloneElements(value: BoardElement[] = elements): BoardElement[] {
		return value.map((element) => ({
			...element,
			points: element.points?.map((point) => ({ ...point }))
		}));
	}

	function sanitizeElements(value: unknown): BoardElement[] {
		if (!Array.isArray(value)) return [];
		const seenIds = new Set<string>();
		const validTypes = new Set<ElementType>([
			'rectangle',
			'diamond',
			'ellipse',
			'arrow',
			'line',
			'draw',
			'text',
			'image'
		]);

		return value.flatMap((candidate): BoardElement[] => {
			if (!candidate || typeof candidate !== 'object') return [];
			const item = candidate as Partial<BoardElement>;
			if (!item.type || !validTypes.has(item.type)) return [];
			const requestedId = typeof item.id === 'string' && item.id ? item.id : createId();
			const id = seenIds.has(requestedId) ? createId() : requestedId;
			seenIds.add(id);
			return [
				{
					id,
					type: item.type,
					x: Number.isFinite(item.x) ? Number(item.x) : 0,
					y: Number.isFinite(item.y) ? Number(item.y) : 0,
					width: Number.isFinite(item.width) ? Number(item.width) : 0,
					height: Number.isFinite(item.height) ? Number(item.height) : 0,
					points: Array.isArray(item.points)
						? item.points
								.filter((point) => Number.isFinite(point?.x) && Number.isFinite(point?.y))
								.map((point) => ({ x: Number(point.x), y: Number(point.y) }))
						: undefined,
					text: typeof item.text === 'string' ? item.text : undefined,
					imageData: typeof item.imageData === 'string' ? item.imageData : undefined,
					stroke: typeof item.stroke === 'string' ? item.stroke : '#1b1b1f',
					fill: typeof item.fill === 'string' ? item.fill : 'transparent',
					strokeWidth: clamp(Number(item.strokeWidth) || 2, 1, 8),
					strokeStyle: ['solid', 'dashed', 'dotted'].includes(item.strokeStyle ?? '')
						? (item.strokeStyle as StrokeStyle)
						: 'solid',
					opacity: clamp(Number(item.opacity) || 100, 10, 100),
					fontSize: clamp(Number(item.fontSize) || 24, 10, 96)
				}
			];
		});
	}

	function makeElement(
		type: ElementType,
		x: number,
		y: number,
		width = 0,
		height = 0,
		overrides: Partial<BoardElement> = {}
	): BoardElement {
		return {
			id: createId(),
			type,
			x,
			y,
			width,
			height,
			stroke: drawingStyle.stroke,
			fill: drawingStyle.fill,
			strokeWidth: drawingStyle.strokeWidth,
			strokeStyle: drawingStyle.strokeStyle,
			opacity: drawingStyle.opacity,
			fontSize: drawingStyle.fontSize,
			...overrides
		};
	}

	function saveBoardSoon(): void {
		if (!mounted) return;
		if (saveTimer) clearTimeout(saveTimer);
		saveState = 'saving';
		saveTimer = setTimeout(saveBoardNow, 250);
	}

	function saveBoardNow(): void {
		if (!mounted) return;
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = undefined;
		const board: StoredBoard = {
			version: 1,
			elements: cloneElements(),
			view: { panX, panY, zoom },
			preferences: { grid: showGrid }
		};
		try {
			localStorage.setItem(activeStorageKey, JSON.stringify(board));
			saveState = 'saved';
		} catch {
			saveState = 'error';
			showToast('The board is too large to save locally');
		}
	}

	function showToast(message: string): void {
		toastMessage = message;
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = setTimeout(() => {
			toastMessage = '';
		}, 2400);
	}

	async function openShareDialog(): Promise<void> {
		previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		copiedShareLink = false;
		shareLink = createShareLink();
		showShare = true;
		await tick();
		shareDialog?.querySelector<HTMLInputElement>('#share-link')?.focus();
	}

	function closeShareDialog(): void {
		showShare = false;
		tick().then(() => previouslyFocused?.focus());
	}

	async function openHelpDialog(): Promise<void> {
		previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		showOverflowMenu = false;
		showHelp = true;
		await tick();
		helpDialog?.querySelector<HTMLButtonElement>('.modal-close')?.focus();
	}

	function closeHelpDialog(): void {
		showHelp = false;
		tick().then(() => previouslyFocused?.focus());
	}

	function trapDialogFocus(event: KeyboardEvent): void {
		if (event.key !== 'Tab') return;
		const dialog = event.currentTarget as HTMLElement;
		const focusable = Array.from(
			dialog.querySelectorAll<HTMLElement>(
				'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
			)
		).filter((element) => !element.hasAttribute('hidden'));
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable.at(-1)!;
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	function closeMenusOnOutsideClick(event: PointerEvent): void {
		const target = event.target;
		if (target instanceof Element && target.closest('[data-popover-root]')) return;
		showMainMenu = false;
		showOverflowMenu = false;
	}

	function recordSnapshot(before: BoardElement[]): void {
		if (JSON.stringify(before) === JSON.stringify(elements)) return;
		undoStack = [...undoStack.slice(-99), before];
		redoStack = [];
		saveBoardNow();
	}

	function undo(): void {
		const previous = undoStack.at(-1);
		if (!previous) return;
		redoStack = [...redoStack, cloneElements()];
		elements = cloneElements(previous);
		undoStack = undoStack.slice(0, -1);
		selectedIds = [];
		textEditor = null;
		saveBoardNow();
	}

	function redo(): void {
		const next = redoStack.at(-1);
		if (!next) return;
		undoStack = [...undoStack, cloneElements()];
		elements = cloneElements(next);
		redoStack = redoStack.slice(0, -1);
		selectedIds = [];
		textEditor = null;
		saveBoardNow();
	}

	function getBounds(element: BoardElement): Bounds {
		if (element.type === 'text') {
			return { x: element.x, y: element.y, ...textDimensions(element.text ?? '', element.fontSize) };
		}

		if (element.type === 'draw' && element.points?.length) {
			const xs = element.points.map((point) => element.x + point.x);
			const ys = element.points.map((point) => element.y + point.y);
			const left = Math.min(...xs);
			const top = Math.min(...ys);
			return {
				x: left,
				y: top,
				width: Math.max(1, Math.max(...xs) - left),
				height: Math.max(1, Math.max(...ys) - top)
			};
		}

		return {
			x: Math.min(element.x, element.x + element.width),
			y: Math.min(element.y, element.y + element.height),
			width: Math.max(1, Math.abs(element.width)),
			height: Math.max(1, Math.abs(element.height))
		};
	}

	function getUnionBounds(items: BoardElement[]): Bounds | null {
		if (items.length === 0) return null;
		const bounds = items.map(getBounds);
		const left = Math.min(...bounds.map((item) => item.x));
		const top = Math.min(...bounds.map((item) => item.y));
		const right = Math.max(...bounds.map((item) => item.x + item.width));
		const bottom = Math.max(...bounds.map((item) => item.y + item.height));
		return { x: left, y: top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) };
	}

	function normalizeBounds(start: Point, end: Point): Bounds {
		return {
			x: Math.min(start.x, end.x),
			y: Math.min(start.y, end.y),
			width: Math.abs(end.x - start.x),
			height: Math.abs(end.y - start.y)
		};
	}

	function boundsIntersect(first: Bounds, second: Bounds): boolean {
		return !(
			first.x + first.width < second.x ||
			second.x + second.width < first.x ||
			first.y + first.height < second.y ||
			second.y + second.height < first.y
		);
	}

	function distanceToSegment(point: Point, start: Point, end: Point): number {
		const dx = end.x - start.x;
		const dy = end.y - start.y;
		if (dx === 0 && dy === 0) return Math.hypot(point.x - start.x, point.y - start.y);
		const position = clamp(
			((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy),
			0,
			1
		);
		return Math.hypot(point.x - (start.x + position * dx), point.y - (start.y + position * dy));
	}

	function hitTest(element: BoardElement, point: Point): boolean {
		const tolerance = 9 / zoom;
		if (element.type === 'line' || element.type === 'arrow') {
			return (
				distanceToSegment(
					point,
					{ x: element.x, y: element.y },
					{ x: element.x + element.width, y: element.y + element.height }
				) <= tolerance
			);
		}

		if (element.type === 'draw' && element.points?.length) {
			for (let index = 1; index < element.points.length; index += 1) {
				const previous = element.points[index - 1];
				const current = element.points[index];
				if (
					distanceToSegment(
						point,
						{ x: element.x + previous.x, y: element.y + previous.y },
						{ x: element.x + current.x, y: element.y + current.y }
					) <= tolerance
				) {
					return true;
				}
			}
			return false;
		}

		const bounds = getBounds(element);
		return (
			point.x >= bounds.x - tolerance &&
			point.x <= bounds.x + bounds.width + tolerance &&
			point.y >= bounds.y - tolerance &&
			point.y <= bounds.y + bounds.height + tolerance
		);
	}

	function elementAt(point: Point): BoardElement | undefined {
		return elements.toReversed().find((element) => hitTest(element, point));
	}

	function screenToWorld(clientX: number, clientY: number): Point {
		const rect = canvasElement?.getBoundingClientRect();
		return {
			x: (clientX - (rect?.left ?? 0) - panX) / zoom,
			y: (clientY - (rect?.top ?? 0) - panY) / zoom
		};
	}

	function worldToScreen(point: Point): Point {
		return { x: point.x * zoom + panX, y: point.y * zoom + panY };
	}

	function chooseTool(tool: Tool): void {
		if (textEditor) finishTextEditor(true);
		showOverflowMenu = false;
		if (tool === 'image') {
			activeTool = tool;
			imageInput?.click();
			return;
		}
		activeTool = tool;
		if (tool !== 'selection') selectedIds = [];
		textEditor = null;
	}

	function handlePointerDown(event: PointerEvent): void {
		if (event.button === 2) return;
		canvasElement?.focus({ preventScroll: true });
		showMainMenu = false;
		showOverflowMenu = false;
		if (textEditor) finishTextEditor(true);
		const point = screenToWorld(event.clientX, event.clientY);
		const isPanGesture = event.button === 1 || spacePressed || activeTool === 'hand';

		if (isPanGesture) {
			event.preventDefault();
			canvasElement?.setPointerCapture(event.pointerId);
			gesture = {
				kind: 'pan',
				startClient: { x: event.clientX, y: event.clientY },
				startPan: { x: panX, y: panY }
			};
			return;
		}

		if (activeTool === 'selection') {
			const additiveSelection = event.shiftKey || event.metaKey || event.ctrlKey;
			const handle = (event.target as SVGElement | null)?.dataset?.resizeHandle as
				| ResizeHandle
				| undefined;
			if (handle && selectionBounds) {
				event.preventDefault();
				canvasElement?.setPointerCapture(event.pointerId);
				gesture = {
					kind: 'resize',
					handle,
					before: cloneElements(),
					originals: cloneElements(elements.filter((item) => selectedIds.includes(item.id))),
					bounds: { ...selectionBounds },
					moved: false
				};
				return;
			}

			const hit = elementAt(point);
			if (hit) {
				if (additiveSelection) {
					event.preventDefault();
					selectedIds = selectedIds.includes(hit.id)
						? selectedIds.filter((id) => id !== hit.id)
						: [...selectedIds, hit.id];
					return;
				}

				if (!selectedIds.includes(hit.id)) selectedIds = [hit.id];
				canvasElement?.setPointerCapture(event.pointerId);
				gesture = {
					kind: 'move',
					start: point,
					before: cloneElements(),
					originals: cloneElements(elements.filter((item) => selectedIds.includes(item.id))),
					moved: false
				};
				return;
			}

			const baseSelection = additiveSelection ? [...selectedIds] : [];
			if (!additiveSelection) selectedIds = [];
			canvasElement?.setPointerCapture(event.pointerId);
			gesture = { kind: 'marquee', start: point, current: point, baseSelection };
			return;
		}

		if (activeTool === 'eraser') {
			canvasElement?.setPointerCapture(event.pointerId);
			const before = cloneElements();
			const changed = eraseAt(point);
			gesture = { kind: 'erase', before, changed };
			hasInteracted = true;
			return;
		}

		if (activeTool === 'text') {
			event.preventDefault();
			beginTextEditor(point);
			hasInteracted = true;
			return;
		}

		if (!drawableTools.has(activeTool)) return;
		const before = cloneElements();
		const element = makeElement(activeTool as ElementType, point.x, point.y);
		if (activeTool === 'draw') element.points = [{ x: 0, y: 0 }];
		elements = [...elements, element];
		selectedIds = [element.id];
		canvasElement?.setPointerCapture(event.pointerId);
		gesture = {
			kind: 'draw',
			elementId: element.id,
			origin: point,
			before,
			moved: false
		};
		hasInteracted = true;
	}

	function handlePointerMove(event: PointerEvent): void {
		if (!gesture) return;
		if (gesture.kind === 'pan') {
			panX = gesture.startPan.x + event.clientX - gesture.startClient.x;
			panY = gesture.startPan.y + event.clientY - gesture.startClient.y;
			return;
		}

		const point = screenToWorld(event.clientX, event.clientY);
		if (gesture.kind === 'draw') {
			const currentGesture = gesture;
			elements = elements.map((element) => {
				if (element.id !== currentGesture.elementId) return element;
				if (element.type === 'draw') {
					const nextPoint = {
						x: point.x - currentGesture.origin.x,
						y: point.y - currentGesture.origin.y
					};
					const points = element.points ?? [];
					const last = points.at(-1);
					if (last && Math.hypot(nextPoint.x - last.x, nextPoint.y - last.y) < 0.8 / zoom) {
						return element;
					}
					return { ...element, points: [...points, nextPoint] };
				}

				let width = point.x - currentGesture.origin.x;
				let height = point.y - currentGesture.origin.y;
				if (event.shiftKey) {
					if (element.type === 'line' || element.type === 'arrow') {
						const length = Math.hypot(width, height);
						const angle = Math.round(Math.atan2(height, width) / (Math.PI / 4)) * (Math.PI / 4);
						width = Math.cos(angle) * length;
						height = Math.sin(angle) * length;
					} else {
						const size = Math.max(Math.abs(width), Math.abs(height));
						width = (width < 0 ? -1 : 1) * size;
						height = (height < 0 ? -1 : 1) * size;
					}
				}
				return { ...element, width, height };
			});
			gesture = { ...gesture, moved: true };
			return;
		}

		if (gesture.kind === 'move') {
			let dx = point.x - gesture.start.x;
			let dy = point.y - gesture.start.y;
			if (event.shiftKey) {
				if (Math.abs(dx) > Math.abs(dy)) dy = 0;
				else dx = 0;
			}
			const originalsById = new Map(gesture.originals.map((item) => [item.id, item]));
			elements = elements.map((element) => {
				const original = originalsById.get(element.id);
				return original ? { ...element, x: original.x + dx, y: original.y + dy } : element;
			});
			gesture = { ...gesture, moved: Math.abs(dx) + Math.abs(dy) > 0.1 };
			return;
		}

		if (gesture.kind === 'resize') {
			resizeSelection(gesture, point, event.shiftKey);
			gesture = { ...gesture, moved: true };
			return;
		}

		if (gesture.kind === 'marquee') {
			const marquee = normalizeBounds(gesture.start, point);
			const found = elements
				.filter((element) => boundsIntersect(getBounds(element), marquee))
				.map((element) => element.id);
			selectedIds = [...new Set([...gesture.baseSelection, ...found])];
			gesture = { ...gesture, current: point };
			return;
		}

		if (gesture.kind === 'erase') {
			const changed = eraseAt(point);
			if (changed) gesture = { ...gesture, changed: true };
		}
	}

	function handlePointerUp(event: PointerEvent): void {
		if (!gesture) return;
		const completedGesture = gesture;
		gesture = null;
		if (canvasElement?.hasPointerCapture(event.pointerId)) {
			canvasElement.releasePointerCapture(event.pointerId);
		}

		if (completedGesture.kind === 'draw') {
			const created = elements.find((element) => element.id === completedGesture.elementId);
			if (created) {
				const bounds = getBounds(created);
				const tooSmall =
					created.type === 'draw'
						? (created.points?.length ?? 0) < 2
						: Math.hypot(bounds.width, bounds.height) < 5 / zoom;
				if (tooSmall && created.type !== 'draw') {
					elements = elements.filter((element) => element.id !== created.id);
					selectedIds = [];
				} else if (created.type === 'draw' && (created.points?.length ?? 0) < 2) {
					elements = elements.map((element) =>
						element.id === created.id
							? { ...element, points: [{ x: 0, y: 0 }, { x: 0.2, y: 0.2 }] }
							: element
					);
				}
			}
			recordSnapshot(completedGesture.before);
			if (!toolLocked) activeTool = 'selection';
		}

		if (completedGesture.kind === 'move' || completedGesture.kind === 'resize') {
			if (completedGesture.moved) recordSnapshot(completedGesture.before);
		}

		if (completedGesture.kind === 'erase' && completedGesture.changed) {
			recordSnapshot(completedGesture.before);
		}

		if (completedGesture.kind === 'pan') saveBoardSoon();
	}

	function handleDoubleClick(event: MouseEvent): void {
		if (activeTool !== 'selection') return;
		const point = screenToWorld(event.clientX, event.clientY);
		const hit = elementAt(point);
		if (hit?.type === 'text') {
			selectedIds = [hit.id];
			beginTextEditor({ x: hit.x, y: hit.y }, hit);
		}
	}

	function eraseAt(point: Point): boolean {
		const hit = elementAt(point);
		if (!hit) return false;
		elements = elements.filter((element) => element.id !== hit.id);
		selectedIds = selectedIds.filter((id) => id !== hit.id);
		return true;
	}

	function resizeSelection(currentGesture: Extract<Gesture, { kind: 'resize' }>, point: Point, lockRatio: boolean): void {
		const originalBounds = currentGesture.bounds;
		let left = originalBounds.x;
		let top = originalBounds.y;
		let right = originalBounds.x + originalBounds.width;
		let bottom = originalBounds.y + originalBounds.height;

		if (currentGesture.handle.includes('w')) left = Math.min(point.x, right - 2 / zoom);
		if (currentGesture.handle.includes('e')) right = Math.max(point.x, left + 2 / zoom);
		if (currentGesture.handle.includes('n')) top = Math.min(point.y, bottom - 2 / zoom);
		if (currentGesture.handle.includes('s')) bottom = Math.max(point.y, top + 2 / zoom);

		if (lockRatio && originalBounds.height > 0) {
			const ratio = originalBounds.width / originalBounds.height;
			const width = right - left;
			const height = bottom - top;
			if (width / height > ratio) {
				const nextHeight = width / ratio;
				if (currentGesture.handle.includes('n')) top = bottom - nextHeight;
				else bottom = top + nextHeight;
			} else {
				const nextWidth = height * ratio;
				if (currentGesture.handle.includes('w')) left = right - nextWidth;
				else right = left + nextWidth;
			}
		}

		const nextBounds = { x: left, y: top, width: right - left, height: bottom - top };
		const scaleX = nextBounds.width / originalBounds.width;
		const scaleY = nextBounds.height / originalBounds.height;
		const transformX = (value: number) => nextBounds.x + (value - originalBounds.x) * scaleX;
		const transformY = (value: number) => nextBounds.y + (value - originalBounds.y) * scaleY;
		const originalsById = new Map(currentGesture.originals.map((item) => [item.id, item]));

		elements = elements.map((element) => {
			const original = originalsById.get(element.id);
			if (!original) return element;
			const startX = transformX(original.x);
			const startY = transformY(original.y);
			const endX = transformX(original.x + original.width);
			const endY = transformY(original.y + original.height);
			return {
				...element,
				x: startX,
				y: startY,
				width: endX - startX,
				height: endY - startY,
				points: original.points?.map((item) => ({ x: item.x * scaleX, y: item.y * scaleY })),
				fontSize: original.type === 'text'
					? clamp(original.fontSize * Math.min(scaleX, scaleY), 10, 160)
					: original.fontSize
			};
		});
	}

	function beginTextEditor(point: Point, existing?: BoardElement): void {
		textEditor = {
			elementId: existing?.id ?? null,
			x: point.x,
			y: point.y,
			value: existing?.text ?? ''
		};
		tick().then(() => {
			requestAnimationFrame(() => {
				textArea?.focus();
				textArea?.select();
			});
		});
	}

	function textDimensions(text: string, fontSize: number): { width: number; height: number } {
		const lines = text.split('\n');
		let widths = lines.map((line) => line.length * fontSize * 0.58);
		if (typeof document !== 'undefined') {
			textMeasureCanvas ??= document.createElement('canvas');
			const context = textMeasureCanvas.getContext('2d');
			if (context) {
				context.font = `${fontSize}px "Comic Sans MS", "Bradley Hand", cursive`;
				widths = lines.map((line) => context.measureText(line || ' ').width);
			}
		}
		return {
			width: Math.max(20, ...widths) + 2,
			height: Math.max(fontSize * 1.25, lines.length * fontSize * 1.25)
		};
	}

	function textEditorFontSize(editor: TextEditor): number {
		if (!editor.elementId) return drawingStyle.fontSize;
		return elements.find((element) => element.id === editor.elementId)?.fontSize ?? drawingStyle.fontSize;
	}

	function textEditorPlacement(editor: TextEditor): { x: number; y: number; width: number; fontSize: number } {
		const screen = worldToScreen({ x: editor.x, y: editor.y });
		const viewportWidth = canvasElement?.clientWidth ?? 360;
		const viewportHeight = canvasElement?.clientHeight ?? 640;
		const width = Math.min(320, Math.max(120, viewportWidth - 24));
		const fontSize = textEditorFontSize(editor) * zoom;
		return {
			x: clamp(screen.x, 12, Math.max(12, viewportWidth - width - 12)),
			y: clamp(screen.y, 12, Math.max(12, viewportHeight - Math.max(70, fontSize * 1.6) - 12)),
			width,
			fontSize
		};
	}

	function finishTextEditor(shouldSave: boolean): void {
		const editor = textEditor;
		if (!editor) return;
		textEditor = null;
		if (!shouldSave || !editor.value.trim()) {
			if (!toolLocked && editor.elementId === null) activeTool = 'selection';
			return;
		}

		const before = cloneElements();
		const dimensions = textDimensions(editor.value, drawingStyle.fontSize);
		if (editor.elementId) {
			elements = elements.map((element) => {
				if (element.id !== editor.elementId) return element;
				const nextDimensions = textDimensions(editor.value, element.fontSize);
				return { ...element, text: editor.value, ...nextDimensions };
			});
		} else {
			const textElement = makeElement('text', editor.x, editor.y, dimensions.width, dimensions.height, {
				text: editor.value,
				fill: 'transparent'
			});
			elements = [...elements, textElement];
			selectedIds = [textElement.id];
		}
		recordSnapshot(before);
		if (!toolLocked) activeTool = 'selection';
	}

	function handleTextKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			event.preventDefault();
			finishTextEditor(false);
		}
		if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			finishTextEditor(true);
		}
	}

	function pointsToPath(points: Point[] = []): string {
		if (points.length === 0) return '';
		if (points.length === 1) return `M ${points[0].x} ${points[0].y} l .1 .1`;
		let path = `M ${points[0].x} ${points[0].y}`;
		for (let index = 1; index < points.length - 1; index += 1) {
			const current = points[index];
			const next = points[index + 1];
			path += ` Q ${current.x} ${current.y} ${(current.x + next.x) / 2} ${(current.y + next.y) / 2}`;
		}
		const last = points.at(-1)!;
		path += ` L ${last.x} ${last.y}`;
		return path;
	}

	function diamondPoints(element: BoardElement): string {
		const bounds = getBounds(element);
		return `${bounds.x + bounds.width / 2},${bounds.y} ${bounds.x + bounds.width},${bounds.y + bounds.height / 2} ${bounds.x + bounds.width / 2},${bounds.y + bounds.height} ${bounds.x},${bounds.y + bounds.height / 2}`;
	}

	function arrowHeadPath(element: BoardElement): string {
		const end = { x: element.x + element.width, y: element.y + element.height };
		const angle = Math.atan2(element.height, element.width);
		const length = Math.min(18, Math.max(8, Math.hypot(element.width, element.height) * 0.25));
		const first = {
			x: end.x - length * Math.cos(angle - Math.PI / 6),
			y: end.y - length * Math.sin(angle - Math.PI / 6)
		};
		const second = {
			x: end.x - length * Math.cos(angle + Math.PI / 6),
			y: end.y - length * Math.sin(angle + Math.PI / 6)
		};
		return `M ${first.x} ${first.y} L ${end.x} ${end.y} L ${second.x} ${second.y}`;
	}

	function dashArray(element: BoardElement): string | undefined {
		if (element.strokeStyle === 'dashed') return `${8 / zoom} ${6 / zoom}`;
		if (element.strokeStyle === 'dotted') return `${1 / zoom} ${7 / zoom}`;
		return undefined;
	}

	function resolvedStroke(stroke: string): string {
		if (isDark && stroke === '#1b1b1f') return '#f1f3f5';
		return stroke;
	}

	function handleWheel(event: WheelEvent): void {
		const target = event.target;
		if (
			target instanceof Element
			&& target !== boardRoot
			&& !target.closest('.drawing-canvas, .canvas-surface')
		) {
			return;
		}
		event.preventDefault();
		const deltaMultiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE
			? 16
			: event.deltaMode === WheelEvent.DOM_DELTA_PAGE
				? canvasElement?.clientHeight ?? window.innerHeight
				: 1;
		const deltaX = event.deltaX * deltaMultiplier;
		const deltaY = event.deltaY * deltaMultiplier;
		if (event.ctrlKey || event.metaKey) {
			const rect = canvasElement?.getBoundingClientRect();
			if (!rect) return;
			const local = { x: event.clientX - rect.left, y: event.clientY - rect.top };
			const world = { x: (local.x - panX) / zoom, y: (local.y - panY) / zoom };
			const nextZoom = clamp(zoom * Math.exp(-deltaY * 0.002), MIN_ZOOM, MAX_ZOOM);
			panX = local.x - world.x * nextZoom;
			panY = local.y - world.y * nextZoom;
			zoom = nextZoom;
		} else {
			panX -= event.shiftKey && deltaX === 0 ? deltaY : deltaX;
			panY -= event.shiftKey ? deltaX : deltaY;
		}
		saveBoardSoon();
	}

	function setZoom(nextZoom: number): void {
		const rect = canvasElement?.getBoundingClientRect();
		if (!rect) return;
		const center = { x: rect.width / 2, y: rect.height / 2 };
		const world = { x: (center.x - panX) / zoom, y: (center.y - panY) / zoom };
		zoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
		panX = center.x - world.x * zoom;
		panY = center.y - world.y * zoom;
		saveBoardSoon();
	}

	function fitToContent(): void {
		const rect = canvasElement?.getBoundingClientRect();
		const bounds = getUnionBounds(elements);
		if (!rect) return;
		if (!bounds) {
			panX = 0;
			panY = 0;
			zoom = 1;
			saveBoardSoon();
			return;
		}
		const padding = 120;
		zoom = clamp(
			Math.min((rect.width - padding * 2) / bounds.width, (rect.height - padding * 2) / bounds.height),
			MIN_ZOOM,
			1.5
		);
		panX = rect.width / 2 - (bounds.x + bounds.width / 2) * zoom;
		panY = rect.height / 2 - (bounds.y + bounds.height / 2) * zoom;
		saveBoardSoon();
	}

	function setStyle<Key extends keyof StyleState>(key: Key, value: StyleState[Key]): void {
		drawingStyle = { ...drawingStyle, [key]: value };
		if (selectedIds.length === 0) return;
		const before = cloneElements();
		elements = elements.map((element) => {
			if (!selectedIds.includes(element.id)) return element;
			const updated = { ...element, [key]: value } as BoardElement;
			if (key === 'fontSize' && element.type === 'text') {
				return { ...updated, ...textDimensions(element.text ?? '', Number(value)) };
			}
			return updated;
		});
		recordSnapshot(before);
	}

	function getActiveStyle<Key extends keyof StyleState>(key: Key): StyleState[Key] {
		return selectedElement?.[key] ?? drawingStyle[key];
	}

	function deleteSelected(): void {
		if (selectedIds.length === 0) return;
		const before = cloneElements();
		elements = elements.filter((element) => !selectedIds.includes(element.id));
		selectedIds = [];
		recordSnapshot(before);
	}

	function duplicateSelected(offset = 18): void {
		const selected = elements.filter((element) => selectedIds.includes(element.id));
		if (selected.length === 0) return;
		const before = cloneElements();
		const duplicated = cloneElements(selected).map((element) => ({
			...element,
			id: createId(),
			x: element.x + offset,
			y: element.y + offset
		}));
		elements = [...elements, ...duplicated];
		selectedIds = duplicated.map((element) => element.id);
		recordSnapshot(before);
	}

	function copySelected(): void {
		clipboardElements = cloneElements(elements.filter((element) => selectedIds.includes(element.id)));
		if (clipboardElements.length > 0) showToast('Copied to whiteboard clipboard');
	}

	function pasteSelected(): void {
		if (clipboardElements.length === 0) return;
		const before = cloneElements();
		const pasted = cloneElements(clipboardElements).map((element) => ({
			...element,
			id: createId(),
			x: element.x + 24,
			y: element.y + 24
		}));
		clipboardElements = cloneElements(pasted);
		elements = [...elements, ...pasted];
		selectedIds = pasted.map((element) => element.id);
		recordSnapshot(before);
	}

	function arrangeSelected(direction: 'front' | 'back'): void {
		if (selectedIds.length === 0) return;
		const before = cloneElements();
		const selected = elements.filter((element) => selectedIds.includes(element.id));
		const rest = elements.filter((element) => !selectedIds.includes(element.id));
		elements = direction === 'front' ? [...rest, ...selected] : [...selected, ...rest];
		recordSnapshot(before);
	}

	function nudgeSelection(dx: number, dy: number): void {
		if (selectedIds.length === 0) return;
		const before = cloneElements();
		elements = elements.map((element) =>
			selectedIds.includes(element.id)
				? { ...element, x: element.x + dx, y: element.y + dy }
				: element
		);
		recordSnapshot(before);
	}

	function cycleKeyboardSelection(direction: 1 | -1): void {
		if (elements.length === 0) {
			accessibilityMessage = 'The canvas is empty';
			return;
		}
		const currentIndex = selectedIds.length === 1
			? elements.findIndex((element) => element.id === selectedIds[0])
			: direction === 1 ? -1 : 0;
		const nextIndex = (currentIndex + direction + elements.length) % elements.length;
		const element = elements[nextIndex];
		selectedIds = [element.id];
		accessibilityMessage = `Selected ${element.type}, item ${nextIndex + 1} of ${elements.length}`;
	}

	function insertActiveToolAtCenter(): void {
		const rect = canvasElement?.getBoundingClientRect();
		if (!rect) return;
		const center = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
		if (activeTool === 'text') {
			beginTextEditor({ x: center.x - 80, y: center.y - drawingStyle.fontSize });
			hasInteracted = true;
			accessibilityMessage = 'Text editor opened at the center of the canvas';
			return;
		}
		if (!drawableTools.has(activeTool)) return;

		const before = cloneElements();
		let element: BoardElement;
		if (activeTool === 'line' || activeTool === 'arrow') {
			element = makeElement(activeTool, center.x - 90, center.y, 180, 0);
		} else if (activeTool === 'draw') {
			element = makeElement('draw', center.x - 40, center.y - 15, 80, 30, {
				points: [
					{ x: 0, y: 20 },
					{ x: 20, y: 0 },
					{ x: 40, y: 24 },
					{ x: 60, y: 4 },
					{ x: 80, y: 18 }
				]
			});
		} else {
			const size = activeTool === 'rectangle' ? { width: 180, height: 110 } : { width: 140, height: 140 };
			element = makeElement(
				activeTool as ElementType,
				center.x - size.width / 2,
				center.y - size.height / 2,
				size.width,
				size.height
			);
		}

		elements = [...elements, element];
		selectedIds = [element.id];
		hasInteracted = true;
		accessibilityMessage = `${element.type} added at the center of the canvas`;
		recordSnapshot(before);
		if (!toolLocked) activeTool = 'selection';
	}

	function handleKeyDown(event: KeyboardEvent): void {
		const target = event.target;
		if (target === textArea) return;

		if (event.key === 'Escape') {
			event.preventDefault();
			if (showShare) closeShareDialog();
			else if (showHelp) closeHelpDialog();
			else {
				showLibrary = false;
				showMainMenu = false;
				showOverflowMenu = false;
				selectedIds = [];
				activeTool = 'selection';
			}
			return;
		}

		if (showShare || showHelp) return;
		if (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLButtonElement ||
			target instanceof HTMLAnchorElement ||
			target instanceof HTMLSelectElement
		) {
			return;
		}

		if (event.key === 'Enter' && event.target === canvasElement) {
			event.preventDefault();
			if (activeTool === 'selection') cycleKeyboardSelection(event.shiftKey ? -1 : 1);
			else insertActiveToolAtCenter();
			return;
		}

		if (event.code === 'Space') {
			spacePressed = true;
			event.preventDefault();
			return;
		}

		const modifier = event.metaKey || event.ctrlKey;
		if (modifier && event.key.toLowerCase() === 'z') {
			event.preventDefault();
			if (event.shiftKey) redo();
			else undo();
			return;
		}
		if (modifier && event.key.toLowerCase() === 'y') {
			event.preventDefault();
			redo();
			return;
		}
		if (modifier && event.key.toLowerCase() === 'a') {
			event.preventDefault();
			selectedIds = elements.map((element) => element.id);
			activeTool = 'selection';
			return;
		}
		if (modifier && event.key.toLowerCase() === 'c') {
			event.preventDefault();
			copySelected();
			return;
		}
		if (modifier && event.key.toLowerCase() === 'd') {
			event.preventDefault();
			duplicateSelected();
			return;
		}
		if (modifier && event.key.toLowerCase() === 'n') {
			event.preventDefault();
			newBoard();
			return;
		}
		if (modifier && event.key.toLowerCase() === 's') {
			event.preventDefault();
			saveBoardFile();
			return;
		}
		if (event.shiftKey && event.code === 'Digit1') {
			event.preventDefault();
			fitToContent();
			return;
		}

		if (event.key === 'Delete' || event.key === 'Backspace') {
			event.preventDefault();
			deleteSelected();
			return;
		}
		const step = event.shiftKey ? 10 : 1;
		if (event.key === 'ArrowLeft') nudgeSelection(-step, 0);
		else if (event.key === 'ArrowRight') nudgeSelection(step, 0);
		else if (event.key === 'ArrowUp') nudgeSelection(0, -step);
		else if (event.key === 'ArrowDown') nudgeSelection(0, step);
		else if (event.key === '+' || event.key === '=') {
			event.preventDefault();
			setZoom(zoom + 0.1);
		} else if (event.key === '-') {
			event.preventDefault();
			setZoom(zoom - 0.1);
		} else if (!modifier) {
			const shortcuts: Record<string, Tool> = {
				'1': 'selection',
				'2': 'rectangle',
				'3': 'diamond',
				'4': 'ellipse',
				'5': 'arrow',
				'6': 'line',
				'7': 'draw',
				'8': 'text',
				'9': 'image',
				'0': 'eraser',
				v: 'selection',
				h: 'hand',
				r: 'rectangle',
				d: 'diamond',
				o: 'ellipse',
				a: 'arrow',
				l: 'line',
				p: 'draw',
				t: 'text',
				e: 'eraser'
			};
			const nextTool = shortcuts[event.key.toLowerCase()];
			if (nextTool) {
				event.preventDefault();
				chooseTool(nextTool);
			}
		}
	}

	function handleKeyUp(event: KeyboardEvent): void {
		if (event.code === 'Space') spacePressed = false;
	}

	function handlePaste(event: ClipboardEvent): void {
		const target = event.target;
		if (showShare || showHelp || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return;

		const clipboard = event.clipboardData;
		const imageItem = Array.from(clipboard?.items ?? []).find((item) => item.type.startsWith('image/'));
		const imageFile = imageItem?.getAsFile()
			?? Array.from(clipboard?.files ?? []).find((file) => file.type.startsWith('image/'));
		if (imageFile) {
			event.preventDefault();
			insertImageFile(imageFile, true);
			return;
		}

		if (clipboardElements.length > 0) {
			event.preventDefault();
			pasteSelected();
		}
	}

	function handleImageFile(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) {
			activeTool = 'selection';
			return;
		}
		if (!file.type.startsWith('image/')) {
			showToast('Please choose an image file');
			input.value = '';
			return;
		}
		insertImageFile(file, false);
		input.value = '';
	}

	function insertImageFile(file: File, pasted: boolean): void {
		const reader = new FileReader();
		reader.onload = () => {
			const data = String(reader.result ?? '');
			const image = new Image();
			image.onload = () => {
				const rect = canvasElement?.getBoundingClientRect();
				if (!rect) return;
				const maxSize = 460;
				const ratio = Math.min(1, maxSize / image.naturalWidth, maxSize / image.naturalHeight);
				const width = Math.max(60, image.naturalWidth * ratio);
				const height = Math.max(60, image.naturalHeight * ratio);
				const center = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
				const before = cloneElements();
				const element = makeElement('image', center.x - width / 2, center.y - height / 2, width, height, {
					imageData: data,
					fill: 'transparent'
				});
				elements = [...elements, element];
				selectedIds = [element.id];
				recordSnapshot(before);
				hasInteracted = true;
				accessibilityMessage = pasted ? 'Clipboard image pasted at the center of the canvas' : 'Image added at the center of the canvas';
				if (pasted || !toolLocked) activeTool = 'selection';
				if (pasted) showToast('Image pasted from clipboard');
			};
			image.onerror = () => showToast('The clipboard image could not be opened');
			image.src = data;
		};
		reader.onerror = () => showToast('The clipboard image could not be read');
		reader.readAsDataURL(file);
	}

	function addLibraryItem(kind: 'note' | 'flow' | 'decision' | 'label'): void {
		const rect = canvasElement?.getBoundingClientRect();
		if (!rect) return;
		const center = screenToWorld(rect.left + rect.width / 2, rect.top + rect.height / 2);
		const before = cloneElements();
		let additions: BoardElement[] = [];

		if (kind === 'note') {
			const note = makeElement('rectangle', center.x - 110, center.y - 75, 220, 150, {
				fill: '#ffec99',
				stroke: '#f08c00'
			});
			const text = makeElement('text', center.x - 76, center.y - 18, 152, 60, {
				text: 'Write an idea',
				stroke: '#5f3dc4',
				fill: 'transparent',
				fontSize: 25
			});
			additions = [note, text];
		} else if (kind === 'flow') {
			const left = makeElement('rectangle', center.x - 260, center.y - 55, 150, 110, { fill: '#d3f9d8' });
			const arrow = makeElement('arrow', center.x - 95, center.y, 150, 0, { fill: 'transparent' });
			const right = makeElement('diamond', center.x + 70, center.y - 70, 140, 140, { fill: '#a5d8ff' });
			additions = [left, arrow, right];
		} else if (kind === 'decision') {
			additions = [makeElement('diamond', center.x - 90, center.y - 90, 180, 180, { fill: '#eebefa' })];
		} else {
			const label = makeElement('text', center.x - 100, center.y - 20, 200, 50, {
				text: 'Section title',
				fontSize: 36,
				fill: 'transparent'
			});
			additions = [label];
		}

		elements = [...elements, ...additions];
		selectedIds = additions.map((element) => element.id);
		activeTool = 'selection';
		recordSnapshot(before);
		showLibrary = false;
		hasInteracted = true;
	}

	async function newBoard(): Promise<void> {
		if (elements.length > 0 && !await showConfirm('Every element on this whiteboard will be removed. This action can still be undone until you leave the page.', {
			title: 'Clear whiteboard?',
			confirmLabel: 'Clear board',
			tone: 'danger'
		})) return;
		const before = cloneElements();
		elements = [];
		selectedIds = [];
		panX = 0;
		panY = 0;
		zoom = 1;
		showMainMenu = false;
		recordSnapshot(before);
	}

	function downloadBlob(blob: Blob, filename: string): void {
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = filename;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		setTimeout(() => URL.revokeObjectURL(url), 0);
	}

	function saveBoardFile(): void {
		const data: StoredBoard = {
			version: 1,
			elements: cloneElements(),
			view: { panX, panY, zoom },
			preferences: { grid: showGrid }
		};
		downloadBlob(
			new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
			`whiteboard-${new Date().toISOString().slice(0, 10)}.json`
		);
		showMainMenu = false;
		showToast('Whiteboard file saved');
	}

	function handleBoardFile(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		file
			.text()
			.then((text) => {
				const parsed = JSON.parse(text) as StoredBoard;
				if (!Array.isArray(parsed.elements)) throw new Error('Invalid whiteboard file');
				const before = cloneElements();
				elements = sanitizeElements(parsed.elements);
				panX = finiteNumber(parsed.view?.panX, 0);
				panY = finiteNumber(parsed.view?.panY, 0);
				zoom = clamp(finiteNumber(parsed.view?.zoom, 1), MIN_ZOOM, MAX_ZOOM);
				showGrid = typeof parsed.preferences?.grid === 'boolean' ? parsed.preferences.grid : showGrid;
				selectedIds = [];
				recordSnapshot(before);
				showToast('Whiteboard opened');
			})
			.catch(() => showToast('That file is not a valid whiteboard'));
		input.value = '';
		showMainMenu = false;
	}

	async function exportPng(): Promise<void> {
		const bounds = getUnionBounds(elements) ?? { x: 0, y: 0, width: 1200, height: 800 };
		const padding = 40;
		const width = Math.max(1, Math.ceil(bounds.width + padding * 2));
		const height = Math.max(1, Math.ceil(bounds.height + padding * 2));
		const content = elementsGroup?.outerHTML ?? '<g></g>';
		const background = isDark ? '#443835' : '#ffffff';
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${background}"/><g transform="translate(${-bounds.x + padding} ${-bounds.y + padding})">${content}</g></svg>`;
		const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
		const image = new Image();

		try {
			await new Promise<void>((resolve, reject) => {
				image.onload = () => resolve();
				image.onerror = () => reject(new Error('Image export failed'));
				image.src = url;
			});
			const scale = Math.min(2, 4096 / width, 4096 / height);
			const canvas = document.createElement('canvas');
			canvas.width = Math.max(1, Math.round(width * scale));
			canvas.height = Math.max(1, Math.round(height * scale));
			const context = canvas.getContext('2d');
			if (!context) throw new Error('Canvas is unavailable');
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
			const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
			if (!blob) throw new Error('Image export failed');
			downloadBlob(blob, `whiteboard-${new Date().toISOString().slice(0, 10)}.png`);
			showToast('PNG exported');
		} catch {
			showToast('The PNG could not be exported');
		} finally {
			URL.revokeObjectURL(url);
			showMainMenu = false;
		}
	}

	function encodeBoard(value: StoredBoard): string {
		const bytes = new TextEncoder().encode(JSON.stringify(value));
		let binary = '';
		for (let index = 0; index < bytes.length; index += 8192) {
			binary += String.fromCharCode(...bytes.subarray(index, index + 8192));
		}
		return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
	}

	function decodeBoard(value: string): StoredBoard {
		const padded = value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - (value.length % 4)) % 4);
		const binary = atob(padded);
		const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
		return JSON.parse(new TextDecoder().decode(bytes)) as StoredBoard;
	}

	function createShareLink(): string {
		if (typeof window === 'undefined') return '';
		const data: StoredBoard = { version: 1, elements: cloneElements() };
		return `${window.location.origin}${window.location.pathname}#board=${encodeBoard(data)}`;
	}

	async function copyShareLink(): Promise<void> {
		try {
			await navigator.clipboard.writeText(shareLink);
			copiedShareLink = true;
			setTimeout(() => (copiedShareLink = false), 1800);
		} catch {
			showToast('Select and copy the link manually');
		}
	}

	async function nativeShare(): Promise<void> {
		if (!navigator.share) {
			await copyShareLink();
			return;
		}
		try {
			await navigator.share({ title: 'Whiteboard', url: shareLink });
		} catch {
			// Closing the system share sheet does not require feedback.
		}
	}

	function toggleGrid(): void {
		showGrid = !showGrid;
		saveBoardSoon();
	}

	function toggleTheme(): void {
		userSettingsStorage.update((settings) => ({
			...settings,
			theme: settings.theme === 'dark' ? 'light' : 'dark'
		}));
	}
</script>

<svelte:head>
	<title>Whiteboard | Cojudge</title>
	<meta
		name="description"
		content="A fast, local-first sketching whiteboard for diagrams, notes, and interview planning."
	/>
</svelte:head>

<main class:dark={isDark} class="whiteboard-page" bind:this={boardRoot}>
	<div
		class:grid={showGrid}
		class="canvas-surface"
		style={`--grid-size: ${24 * zoom}px; --grid-x: ${panX}px; --grid-y: ${panY}px;`}
	></div>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<svg
		bind:this={canvasElement}
		class:grab-cursor={activeTool === 'hand' || spacePressed}
		class:grabbing-cursor={gesture?.kind === 'pan'}
		class:crosshair-cursor={drawableTools.has(activeTool) && activeTool !== 'text'}
		class:text-cursor={activeTool === 'text'}
		class:eraser-cursor={activeTool === 'eraser'}
		class="drawing-canvas"
		role="application"
		aria-label="Whiteboard drawing canvas"
		tabindex="0"
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerUp}
		ondblclick={handleDoubleClick}
		onauxclick={(event) => event.preventDefault()}
		oncontextmenu={(event) => event.preventDefault()}
	>
		<g transform={`translate(${panX} ${panY}) scale(${zoom})`}>
			<g class="elements-layer" bind:this={elementsGroup}>
				{#each elements as element (element.id)}
					<g
						opacity={element.opacity / 100}
						class:hidden-element={textEditor?.elementId === element.id}
					>
						{#if element.type === 'rectangle'}
							{@const bounds = getBounds(element)}
							<rect
								x={bounds.x}
								y={bounds.y}
								width={bounds.width}
								height={bounds.height}
								rx="3"
								fill={element.fill === 'transparent' ? 'none' : element.fill}
								stroke={resolvedStroke(element.stroke)}
								stroke-width={element.strokeWidth}
								stroke-dasharray={dashArray(element)}
							/>
						{:else if element.type === 'diamond'}
							<polygon
								points={diamondPoints(element)}
								fill={element.fill === 'transparent' ? 'none' : element.fill}
								stroke={resolvedStroke(element.stroke)}
								stroke-width={element.strokeWidth}
								stroke-dasharray={dashArray(element)}
							/>
						{:else if element.type === 'ellipse'}
							{@const bounds = getBounds(element)}
							<ellipse
								cx={bounds.x + bounds.width / 2}
								cy={bounds.y + bounds.height / 2}
								rx={bounds.width / 2}
								ry={bounds.height / 2}
								fill={element.fill === 'transparent' ? 'none' : element.fill}
								stroke={resolvedStroke(element.stroke)}
								stroke-width={element.strokeWidth}
								stroke-dasharray={dashArray(element)}
							/>
						{:else if element.type === 'line' || element.type === 'arrow'}
							<path
								d={`M ${element.x} ${element.y} L ${element.x + element.width} ${element.y + element.height}`}
								fill="none"
								stroke={resolvedStroke(element.stroke)}
								stroke-width={element.strokeWidth}
								stroke-dasharray={dashArray(element)}
							/>
							{#if element.type === 'arrow'}
								<path
									d={arrowHeadPath(element)}
									fill="none"
									stroke={resolvedStroke(element.stroke)}
									stroke-width={element.strokeWidth}
								/>
							{/if}
						{:else if element.type === 'draw'}
							<path
								d={pointsToPath(element.points)}
								transform={`translate(${element.x} ${element.y})`}
								fill="none"
								stroke={resolvedStroke(element.stroke)}
								stroke-width={element.strokeWidth}
								stroke-dasharray={dashArray(element)}
							/>
						{:else if element.type === 'text'}
							<text
								fill={resolvedStroke(element.stroke)}
								font-size={element.fontSize}
								font-family="'Comic Sans MS', 'Bradley Hand', cursive"
							>
								{#each (element.text ?? '').split('\n') as line, index}
									<tspan x={element.x} y={element.y + element.fontSize + index * element.fontSize * 1.25}
										>{line || ' '}</tspan
									>
								{/each}
							</text>
						{:else if element.type === 'image' && element.imageData}
							{@const bounds = getBounds(element)}
							<image
								href={element.imageData}
								x={bounds.x}
								y={bounds.y}
								width={bounds.width}
								height={bounds.height}
								preserveAspectRatio="none"
							/>
						{/if}
					</g>
				{/each}
			</g>

			{#if activeTool === 'selection' && selectionBounds}
				<g class="selection-layer" data-export-ignore="true">
					{#if selectedIds.length > 1}
						{#each elements.filter((element) => selectedIds.includes(element.id)) as selectedElement (selectedElement.id)}
							{@const itemBounds = getBounds(selectedElement)}
							<rect
								class="individual-selection"
								x={itemBounds.x - 2 / zoom}
								y={itemBounds.y - 2 / zoom}
								width={itemBounds.width + 4 / zoom}
								height={itemBounds.height + 4 / zoom}
								fill="none"
								stroke="#6965db"
								stroke-opacity="0.72"
								stroke-width={1 / zoom}
								stroke-dasharray={`${3 / zoom} ${3 / zoom}`}
							/>
						{/each}
					{/if}
					<rect
						class="group-selection"
						x={selectionBounds.x - 5 / zoom}
						y={selectionBounds.y - 5 / zoom}
						width={selectionBounds.width + 10 / zoom}
						height={selectionBounds.height + 10 / zoom}
						fill="none"
						stroke="#6965db"
						stroke-width={1.25 / zoom}
						stroke-dasharray={`${4 / zoom} ${3 / zoom}`}
					/>
					{#each [
						{ handle: 'nw', x: selectionBounds.x - 5 / zoom, y: selectionBounds.y - 5 / zoom },
						{ handle: 'ne', x: selectionBounds.x + selectionBounds.width + 5 / zoom, y: selectionBounds.y - 5 / zoom },
						{ handle: 'se', x: selectionBounds.x + selectionBounds.width + 5 / zoom, y: selectionBounds.y + selectionBounds.height + 5 / zoom },
						{ handle: 'sw', x: selectionBounds.x - 5 / zoom, y: selectionBounds.y + selectionBounds.height + 5 / zoom }
					] as item}
						<rect
							x={item.x - 4.5 / zoom}
							y={item.y - 4.5 / zoom}
							width={9 / zoom}
							height={9 / zoom}
							rx={1.5 / zoom}
							fill="white"
							stroke="#6965db"
							stroke-width={1.25 / zoom}
							data-resize-handle={item.handle}
							class="resize-handle"
						/>
					{/each}
				</g>
			{/if}

			{#if gesture?.kind === 'marquee'}
				{@const marquee = normalizeBounds(gesture.start, gesture.current)}
				<rect
					class="marquee"
					x={marquee.x}
					y={marquee.y}
					width={marquee.width}
					height={marquee.height}
					stroke-width={1 / zoom}
				/>
			{/if}
		</g>
	</svg>
	<div class="sr-only" aria-live="polite">{accessibilityMessage}</div>

	{#if textEditor}
		{@const editorPosition = textEditorPlacement(textEditor)}
		<textarea
			bind:this={textArea}
			bind:value={textEditor.value}
			class="text-editor"
			aria-label="Whiteboard text"
			placeholder="Type something..."
			style={`left: ${editorPosition.x}px; top: ${editorPosition.y}px; width: ${editorPosition.width}px; font-size: ${editorPosition.fontSize}px; line-height: 1.25;`}
			onkeydown={handleTextKeyDown}
			onblur={() => finishTextEditor(true)}
		></textarea>
	{/if}

	<div class="top-left" data-popover-root>
		<button
			class:active={showMainMenu}
			class="square-button menu-trigger"
			title="Main menu"
			aria-label="Open main menu"
			aria-expanded={showMainMenu}
			onclick={() => (showMainMenu = !showMainMenu)}
		>
			<WhiteboardIcon name="menu" size={21} />
		</button>

		{#if showMainMenu}
			<div class="popover main-menu">
				<div class="menu-brand">
					<span class="brand-mark">C</span>
					<div><strong>Cojudge Whiteboard</strong><small>Saved locally</small></div>
				</div>
				<div class="menu-separator"></div>
				<a class="menu-item" href="/">
					<WhiteboardIcon name="home" size={18} /><span>Back to Cojudge</span>
				</a>
				<button class="menu-item" onclick={newBoard}>
					<WhiteboardIcon name="plus" size={18} /><span>New whiteboard</span><kbd>Ctrl N</kbd>
				</button>
				<button class="menu-item" onclick={() => boardInput?.click()}>
					<WhiteboardIcon name="upload" size={18} /><span>Open</span>
				</button>
				<button class="menu-item" onclick={saveBoardFile}>
					<WhiteboardIcon name="download" size={18} /><span>Save to file</span>
				</button>
				<button class="menu-item" onclick={exportPng}>
					<WhiteboardIcon name="image" size={18} /><span>Export PNG</span>
				</button>
				<div class="menu-separator"></div>
				<button class="menu-item" onclick={toggleGrid}>
					<WhiteboardIcon name="grid" size={18} /><span>Canvas grid</span>
					<span class:enabled={showGrid} class="switch"><span></span></span>
				</button>
				<button class="menu-item" onclick={toggleTheme}>
					<WhiteboardIcon name={isDark ? 'sun' : 'moon'} size={18} />
					<span>{isDark ? 'Light mode' : 'Dark mode'}</span>
				</button>
				<button class="menu-item danger" onclick={newBoard}>
					<WhiteboardIcon name="trash" size={18} /><span>Clear canvas</span>
				</button>
			</div>
		{/if}
	</div>

	<div class="top-toolbar" role="toolbar" aria-label="Drawing tools" data-popover-root>
		<button
			class:active={toolLocked}
			class="tool-button lock-button"
			title={toolLocked ? 'Keep active tool selected' : 'Lock active tool'}
			aria-label="Lock active tool"
			aria-pressed={toolLocked}
			onclick={() => (toolLocked = !toolLocked)}
		>
			<WhiteboardIcon name={toolLocked ? 'lock' : 'unlock'} size={19} />
		</button>
		<span class="toolbar-separator"></span>
		{#each tools as tool}
			<button
				class:active={activeTool === tool.id}
				class="tool-button"
				title={tool.label}
				aria-label={tool.label}
				aria-pressed={activeTool === tool.id}
				onclick={() => chooseTool(tool.id)}
			>
				<WhiteboardIcon name={tool.icon} size={20} />
				{#if tool.shortcut}<span class="shortcut-number">{tool.shortcut}</span>{/if}
			</button>
		{/each}
		<span class="toolbar-separator end-separator"></span>
		<button
			class:active={showOverflowMenu}
			class="tool-button"
			title="More tools"
			aria-label="More tools"
			aria-expanded={showOverflowMenu}
			onclick={() => (showOverflowMenu = !showOverflowMenu)}
		>
			<WhiteboardIcon name="more" size={20} />
		</button>

	</div>

	{#if showOverflowMenu}
		<div class="popover overflow-menu" data-popover-root>
			<button class="menu-item" onclick={fitToContent}>
				<WhiteboardIcon name="fit" size={18} /><span>Zoom to fit</span><kbd>Shift 1</kbd>
			</button>
			<button class="menu-item" onclick={() => { showLibrary = true; showOverflowMenu = false; }}>
				<WhiteboardIcon name="panel" size={18} /><span>Open library</span>
			</button>
			<button class="menu-item" onclick={openHelpDialog}>
				<WhiteboardIcon name="help" size={18} /><span>Keyboard shortcuts</span>
			</button>
		</div>
	{/if}

	{#if elements.length === 0 && !hasInteracted}
		<p class="canvas-hint">
			Pan with two fingers, or hold <kbd>Space</kbd> or the middle mouse button while dragging
		</p>
	{/if}

	<div class="top-actions">
		<button class="share-button" onclick={openShareDialog}>Share</button>
		<button
			class:active={showLibrary}
			class="square-button"
			title="Library"
			aria-label="Toggle library"
			aria-pressed={showLibrary}
			onclick={() => (showLibrary = !showLibrary)}
		>
			<WhiteboardIcon name="panel" size={20} />
		</button>
	</div>

	{#if selectedIds.length > 0 || drawableTools.has(activeTool)}
		<aside class="style-panel" aria-label="Element styles">
			<div class="panel-section">
				<span class="section-label">Stroke</span>
				<div class="color-row">
					{#each strokeColors as color}
						<button
							class:selected={getActiveStyle('stroke') === color}
							class="color-swatch"
							style={`--swatch: ${color}`}
							title={color}
							aria-label={`Use stroke color ${color}`}
							onclick={() => setStyle('stroke', color)}
						></button>
					{/each}
				</div>
			</div>

			{#if activeTool !== 'text' && selectedElement?.type !== 'text' && activeTool !== 'line' && activeTool !== 'arrow' && activeTool !== 'draw'}
				<div class="panel-section">
					<span class="section-label">Background</span>
					<div class="color-row">
						{#each fillColors as color}
							<button
								class:selected={getActiveStyle('fill') === color}
								class:transparent={color === 'transparent'}
								class="color-swatch"
								style={`--swatch: ${color === 'transparent' ? 'var(--panel-bg)' : color}`}
								title={color === 'transparent' ? 'Transparent' : color}
								aria-label={color === 'transparent' ? 'Use transparent background' : `Use background ${color}`}
								onclick={() => setStyle('fill', color)}
							></button>
						{/each}
					</div>
				</div>
			{/if}

			<div class="panel-columns">
				<div class="panel-section">
					<span class="section-label">Stroke width</span>
					<div class="segmented-control">
						{#each [1, 2, 4] as width}
							<button
								class:active={getActiveStyle('strokeWidth') === width}
								aria-label={`Stroke width ${width}`}
								onclick={() => setStyle('strokeWidth', width)}
							><span style={`height: ${width}px`}></span></button>
						{/each}
					</div>
				</div>
				<div class="panel-section">
					<span class="section-label">Stroke style</span>
					<div class="segmented-control">
						{#each ['solid', 'dashed', 'dotted'] as style}
							<button
								class:active={getActiveStyle('strokeStyle') === style}
								aria-label={`${style} stroke`}
								onclick={() => setStyle('strokeStyle', style as StrokeStyle)}
							><span class={`line-${style}`}></span></button>
						{/each}
					</div>
				</div>
			</div>

			{#if activeTool === 'text' || selectedElement?.type === 'text'}
				<div class="panel-section">
					<label class="range-label" for="font-size"><span>Font size</span><output>{getActiveStyle('fontSize')}</output></label>
					<input
						id="font-size"
						type="range"
						min="12"
						max="64"
						step="2"
						value={getActiveStyle('fontSize')}
						oninput={(event) => setStyle('fontSize', Number(event.currentTarget.value))}
					/>
				</div>
			{/if}

			<div class="panel-section">
				<label class="range-label" for="opacity"><span>Opacity</span><output>{getActiveStyle('opacity')}%</output></label>
				<input
					id="opacity"
					type="range"
					min="10"
					max="100"
					step="10"
					value={getActiveStyle('opacity')}
					oninput={(event) => setStyle('opacity', Number(event.currentTarget.value))}
				/>
			</div>

			{#if selectedIds.length > 0}
				<div class="panel-actions">
					<button title="Send to back" aria-label="Send to back" onclick={() => arrangeSelected('back')}>
						<WhiteboardIcon name="layers-down" size={18} />
					</button>
					<button title="Bring to front" aria-label="Bring to front" onclick={() => arrangeSelected('front')}>
						<WhiteboardIcon name="layers-up" size={18} />
					</button>
					<button title="Duplicate" aria-label="Duplicate" onclick={() => duplicateSelected()}>
						<WhiteboardIcon name="copy" size={18} />
					</button>
					<button class="delete" title="Delete" aria-label="Delete" onclick={deleteSelected}>
						<WhiteboardIcon name="trash" size={18} />
					</button>
				</div>
			{/if}
		</aside>
	{/if}

	{#if showLibrary}
		<aside class="library-panel" aria-label="Shape library">
			<header>
				<div><span class="eyebrow">Reusable elements</span><h2>Library</h2></div>
				<button class="icon-button" aria-label="Close library" onclick={() => (showLibrary = false)}>
					<WhiteboardIcon name="close" size={20} />
				</button>
			</header>
			<p>Drop a ready-made building block onto your canvas.</p>
			<div class="library-grid">
				<button onclick={() => addLibraryItem('note')}>
					<span class="library-preview note-preview"><i></i><i></i><i></i></span>
					<strong>Idea note</strong>
				</button>
				<button onclick={() => addLibraryItem('flow')}>
					<span class="library-preview flow-preview"><i></i><b></b><em></em></span>
					<strong>Flow step</strong>
				</button>
				<button onclick={() => addLibraryItem('decision')}>
					<span class="library-preview decision-preview"><i></i></span>
					<strong>Decision</strong>
				</button>
				<button onclick={() => addLibraryItem('label')}>
					<span class="library-preview label-preview">Aa</span>
					<strong>Section title</strong>
				</button>
			</div>
			<div class="library-tip"><WhiteboardIcon name="plus" size={17} /> More packs can be added later.</div>
		</aside>
	{/if}

	<div class="bottom-left">
		<div class="zoom-controls">
			<button title="Zoom out" aria-label="Zoom out" onclick={() => setZoom(zoom - 0.1)}>
				<WhiteboardIcon name="minus" size={18} />
			</button>
			<button class="zoom-value" title="Reset zoom" onclick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
			<button title="Zoom in" aria-label="Zoom in" onclick={() => setZoom(zoom + 0.1)}>
				<WhiteboardIcon name="plus" size={18} />
			</button>
		</div>
		<div class="history-controls">
			<button disabled={undoStack.length === 0} title="Undo" aria-label="Undo" onclick={undo}>
				<WhiteboardIcon name="undo" size={19} />
			</button>
			<button disabled={redoStack.length === 0} title="Redo" aria-label="Redo" onclick={redo}>
				<WhiteboardIcon name="redo" size={19} />
			</button>
		</div>
	</div>

	<div class="bottom-right">
		<div
			class:error={saveState === 'error'}
			class:saving={saveState === 'saving'}
			class="saved-indicator"
			title={saveState === 'saved' ? 'Saved locally' : saveState === 'saving' ? 'Saving locally' : 'Could not save locally'}
		>
			<WhiteboardIcon name="shield" size={23} /><span>{saveState === 'saved' ? 'Saved' : saveState === 'saving' ? 'Saving...' : 'Not saved'}</span>
		</div>
		<button class="square-button" title="Help" aria-label="Open help" onclick={openHelpDialog}>
			<WhiteboardIcon name="help" size={20} />
		</button>
	</div>

	{#if showShare}
		<div class="modal-shell">
			<button class="modal-backdrop" aria-label="Close share dialog" onclick={closeShareDialog}></button>
			<div
				bind:this={shareDialog}
				class="modal-card share-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="share-title"
				tabindex="-1"
				onkeydown={trapDialogFocus}
			>
				<button class="modal-close" aria-label="Close" onclick={closeShareDialog}>
					<WhiteboardIcon name="close" size={20} />
				</button>
				<div class="modal-icon"><WhiteboardIcon name="external" size={24} /></div>
				<span class="eyebrow">Self-contained link</span>
				<h2 id="share-title">Share your whiteboard</h2>
				<p>The drawing is embedded in this private link. No account or server upload is required.</p>
				<label for="share-link">Share link</label>
				<div class="share-link-row">
					<input id="share-link" readonly value={shareLink} onclick={(event) => event.currentTarget.select()} />
					<button class:copied={copiedShareLink} onclick={copyShareLink}>
						<WhiteboardIcon name={copiedShareLink ? 'check' : 'copy'} size={18} />
						{copiedShareLink ? 'Copied' : 'Copy'}
					</button>
				</div>
				<button class="primary-modal-button" onclick={nativeShare}>Share link</button>
				<small>Large embedded images can make the link long. Use "Save to file" for image-heavy boards.</small>
			</div>
		</div>
	{/if}

	{#if showHelp}
		<div class="modal-shell">
			<button class="modal-backdrop" aria-label="Close help dialog" onclick={closeHelpDialog}></button>
			<div
				bind:this={helpDialog}
				class="modal-card help-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="help-title"
				tabindex="-1"
				onkeydown={trapDialogFocus}
			>
				<button class="modal-close" aria-label="Close" onclick={closeHelpDialog}>
					<WhiteboardIcon name="close" size={20} />
				</button>
				<span class="eyebrow">Quick reference</span>
				<h2 id="help-title">Keyboard shortcuts</h2>
				<div class="shortcut-list">
					<div><span>Selection</span><kbd>1</kbd><kbd>V</kbd></div>
					<div><span>Rectangle / ellipse</span><kbd>R</kbd><kbd>O</kbd></div>
					<div><span>Arrow / line</span><kbd>A</kbd><kbd>L</kbd></div>
					<div><span>Free draw / text</span><kbd>P</kbd><kbd>T</kbd></div>
					<div><span>Pan canvas</span><kbd>Trackpad</kbd><kbd>Middle mouse</kbd></div>
					<div><span>Place / cycle selection</span><kbd>Enter</kbd><kbd>Shift Enter</kbd></div>
					<div><span>Undo / redo</span><kbd>Ctrl Z</kbd><kbd>Shift Ctrl Z</kbd></div>
					<div><span>Duplicate</span><kbd>Ctrl D</kbd></div>
					<div><span>Delete selected</span><kbd>Delete</kbd></div>
				</div>
			</div>
		</div>
	{/if}

	{#if toastMessage}
		<div class="toast" role="status"><WhiteboardIcon name="check" size={17} />{toastMessage}</div>
	{/if}

	<input
		bind:this={imageInput}
		class="hidden-input"
		type="file"
		accept="image/*"
		aria-label="Choose an image"
		onchange={handleImageFile}
	/>
	<input
		bind:this={boardInput}
		class="hidden-input"
		type="file"
		accept="application/json,.json"
		aria-label="Open a whiteboard file"
		onchange={handleBoardFile}
	/>
</main>

<style>
	:global(html:has(.whiteboard-page)) {
		overflow: hidden;
		overscroll-behavior: none;
		scrollbar-gutter: auto;
	}

	.whiteboard-page {
		--canvas: var(--color-bg, #f8fafc);
		--ui-bg: var(--color-bg, #f8fafc);
		--panel-bg: var(--color-bg, #f8fafc);
		--button-bg: var(--color-surface, #ffffff);
		--button-hover: var(--color-surface-hover, #f1f5f9);
		--active: color-mix(in srgb, #6965db 18%, var(--color-bg, #f8fafc));
		--active-strong: #6965db;
		--text: var(--color-text, #0f172a);
		--muted: var(--color-text-secondary, #475569);
		--faint: var(--color-text-secondary, #64748b);
		--border: var(--color-border, rgba(0, 0, 0, 0.1));
		position: fixed;
		inset: 0;
		z-index: 1000;
		overflow: hidden;
		overscroll-behavior: none;
		background: var(--canvas);
		color: var(--text);
		font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
		font-size: 14px;
		line-height: 1.35;
		user-select: none;
	}

	.whiteboard-page button,
	.whiteboard-page input,
	.whiteboard-page textarea {
		font: inherit;
	}

	.whiteboard-page button {
		color: inherit;
	}

	.canvas-surface,
	.drawing-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.canvas-surface {
		background-color: var(--canvas);
		transition: background-color 160ms ease;
	}

	.canvas-surface.grid {
		background-image: radial-gradient(circle, color-mix(in srgb, var(--text) 16%, transparent) 1.1px, transparent 1.1px);
		background-position: var(--grid-x) var(--grid-y);
		background-size: var(--grid-size) var(--grid-size);
	}

	.drawing-canvas {
		z-index: 1;
		outline: none;
		touch-action: none;
		cursor: default;
	}

	.drawing-canvas:focus-visible {
		outline: 2px solid color-mix(in srgb, var(--active-strong) 70%, transparent);
		outline-offset: -4px;
	}

	.drawing-canvas.crosshair-cursor { cursor: crosshair; }
	.drawing-canvas.text-cursor { cursor: text; }
	.drawing-canvas.eraser-cursor { cursor: cell; }
	.drawing-canvas.grab-cursor { cursor: grab; }
	.drawing-canvas.grabbing-cursor { cursor: grabbing; }

	.elements-layer {
		pointer-events: none;
	}

	.elements-layer :global(path),
	.elements-layer :global(rect),
	.elements-layer :global(ellipse),
	.elements-layer :global(polygon) {
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.hidden-element { opacity: 0; }

	.selection-layer { pointer-events: none; }
	.resize-handle { pointer-events: all; }
	.resize-handle[data-resize-handle='nw'],
	.resize-handle[data-resize-handle='se'] { cursor: nwse-resize; }
	.resize-handle[data-resize-handle='ne'],
	.resize-handle[data-resize-handle='sw'] { cursor: nesw-resize; }

	.marquee {
		fill: rgba(105, 101, 219, 0.08);
		stroke: #6965db;
		stroke-dasharray: 5 3;
		pointer-events: none;
	}

	.square-button,
	.tool-button,
	.zoom-controls button,
	.history-controls button,
	.icon-button {
		appearance: none;
		border: 0;
		background: transparent;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 120ms ease, color 120ms ease, transform 120ms ease;
	}

	.square-button {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background: var(--button-bg);
	}

	.square-button:hover,
	.square-button.active { background: var(--button-hover); }
	.square-button:active { transform: scale(0.96); }

	.top-left {
		position: absolute;
		top: 16px;
		left: 16px;
		z-index: 20;
	}

	.top-toolbar {
		position: absolute;
		top: 16px;
		left: 50%;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 3px;
		padding: 5px;
		transform: translateX(-50%);
		border: 1px solid var(--border);
		border-radius: 13px;
		background: var(--ui-bg);
		box-shadow: 0 2px 6px rgba(20, 20, 25, 0.06), 0 12px 30px rgba(20, 20, 25, 0.08);
		backdrop-filter: blur(16px);
	}

	.tool-button {
		position: relative;
		flex: 0 0 auto;
		width: 42px;
		height: 42px;
		border-radius: 10px;
	}

	.tool-button:hover { background: var(--button-bg); }
	.tool-button.active {
		background: var(--active);
		color: #4338a8;
	}

	.dark .tool-button.active { color: #dddafe; }

	.shortcut-number {
		position: absolute;
		right: 4px;
		bottom: 2px;
		font-size: 9px;
		line-height: 1;
		color: var(--faint);
	}

	.toolbar-separator {
		width: 1px;
		height: 24px;
		margin: 0 3px;
		background: var(--border);
	}

	.end-separator { display: none; }

	.canvas-hint {
		position: absolute;
		top: 78px;
		left: 50%;
		z-index: 3;
		margin: 0;
		transform: translateX(-50%);
		color: #adadb3;
		font-size: 14px;
		white-space: nowrap;
		pointer-events: none;
	}

	kbd {
		display: inline-flex;
		min-width: 20px;
		height: 20px;
		align-items: center;
		justify-content: center;
		padding: 0 5px;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--panel-bg);
		color: var(--muted);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 500;
		line-height: 1;
		box-shadow: 0 1px 0 color-mix(in srgb, var(--text) 10%, transparent);
	}

	.canvas-hint kbd {
		height: 21px;
		margin: 0 2px;
		font-size: 12px;
		color: #9a9aa1;
	}

	.top-actions {
		position: absolute;
		top: 16px;
		right: 16px;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.share-button {
		height: 48px;
		padding: 0 18px;
		border: 0;
		border-radius: 11px;
		font-weight: 600;
		cursor: pointer;
		transition: filter 120ms ease, transform 120ms ease;
	}

	.share-button { background: #6965db; color: white !important; font-size: 15px; }
	.share-button:hover { filter: brightness(0.97); }
	.share-button:active { transform: scale(0.97); }

	.popover,
	.style-panel,
	.library-panel {
		border: 1px solid var(--border);
		background: var(--panel-bg);
		box-shadow: 0 16px 50px rgba(20, 20, 25, 0.13), 0 2px 8px rgba(20, 20, 25, 0.06);
	}

	.popover {
		position: absolute;
		z-index: 40;
		padding: 8px;
		border-radius: 13px;
	}

	.main-menu {
		top: 56px;
		left: 0;
		width: 260px;
		max-height: calc(100dvh - 88px);
		overflow-y: auto;
	}

	.menu-brand {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 8px 9px 10px;
	}

	.brand-mark {
		display: inline-flex;
		width: 34px;
		height: 34px;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		background: #6965db;
		color: white;
		font-family: Georgia, serif;
		font-size: 20px;
		font-weight: 700;
	}

	.menu-brand div { display: flex; flex-direction: column; gap: 1px; }
	.menu-brand strong { font-size: 13px; }
	.menu-brand small { color: var(--muted); font-size: 11px; }

	.menu-separator {
		height: 1px;
		margin: 5px 4px;
		background: var(--border);
	}

	.menu-item {
		appearance: none;
		width: 100%;
		height: 38px;
		display: grid;
		grid-template-columns: 22px 1fr auto;
		align-items: center;
		gap: 8px;
		padding: 0 9px;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: var(--text) !important;
		text-align: left;
		text-decoration: none;
		cursor: pointer;
	}

	.menu-item:hover { background: var(--button-bg); opacity: 1; }
	.menu-item.danger { color: #e03131 !important; }
	.menu-item kbd { justify-self: end; border: 0; box-shadow: none; background: transparent; }

	.switch {
		position: relative;
		width: 30px;
		height: 18px;
		border-radius: 999px;
		background: #c9c9cf;
		transition: background 120ms ease;
	}

	.switch span {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: white;
		transition: transform 120ms ease;
	}

	.switch.enabled { background: #6965db; }
	.switch.enabled span { transform: translateX(12px); }

	.overflow-menu {
		top: 76px;
		left: calc(50% + 82px);
		width: 220px;
	}

	.style-panel {
		position: absolute;
		top: 82px;
		left: 16px;
		z-index: 15;
		width: 228px;
		padding: 14px;
		border-radius: 13px;
	}

	.panel-section { margin-bottom: 15px; }
	.panel-section:last-child { margin-bottom: 0; }
	.section-label {
		display: block;
		margin-bottom: 7px;
		color: var(--muted);
		font-size: 11px;
		font-weight: 650;
		letter-spacing: 0.02em;
	}

	.color-row { display: flex; gap: 7px; }
	.color-swatch {
		position: relative;
		width: 26px;
		height: 26px;
		padding: 0;
		border: 2px solid var(--panel-bg);
		border-radius: 7px;
		background: var(--swatch);
		box-shadow: 0 0 0 1px var(--border);
		cursor: pointer;
	}

	.color-swatch.selected { box-shadow: 0 0 0 2px var(--active-strong); }
	.color-swatch.transparent::after {
		content: '';
		position: absolute;
		top: 11px;
		left: 2px;
		width: 18px;
		height: 2px;
		transform: rotate(-45deg);
		background: #e03131;
	}

	.panel-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
	.segmented-control {
		display: flex;
		padding: 2px;
		border-radius: 8px;
		background: var(--button-bg);
	}

	.segmented-control button {
		width: 30px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 6px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		cursor: pointer;
	}

	.segmented-control button.active { background: var(--panel-bg); box-shadow: 0 1px 4px rgba(0, 0, 0, 0.09); }
	.segmented-control button span { display: block; width: 18px; background: currentColor; border-radius: 10px; }
	.segmented-control .line-solid { height: 2px; }
	.segmented-control .line-dashed { height: 0; border-top: 2px dashed currentColor; background: transparent; }
	.segmented-control .line-dotted { height: 0; border-top: 2px dotted currentColor; background: transparent; }

	.range-label { display: flex; align-items: center; justify-content: space-between; color: var(--muted); font-size: 11px; font-weight: 650; }
	.range-label output { color: var(--text); font-variant-numeric: tabular-nums; }
	.panel-section input[type='range'] { width: 100%; height: 4px; margin: 10px 0 0; accent-color: #6965db; }

	.panel-actions {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 5px;
		padding-top: 12px;
		border-top: 1px solid var(--border);
	}

	.panel-actions button {
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 7px;
		background: var(--button-bg);
		cursor: pointer;
	}

	.panel-actions button:hover { background: var(--button-hover); }
	.panel-actions .delete:hover { color: #e03131; background: #fff0f0; }

	.library-panel {
		position: absolute;
		top: 78px;
		right: 16px;
		bottom: 82px;
		z-index: 18;
		width: 310px;
		padding: 20px;
		border-radius: 16px;
		overflow: auto;
		animation: slide-in 180ms ease-out;
	}

	@keyframes slide-in {
		from { opacity: 0; transform: translateX(12px); }
		to { opacity: 1; transform: translateX(0); }
	}

	.library-panel header { display: flex; align-items: flex-start; justify-content: space-between; }
	.library-panel h2,
	.modal-card h2 { margin: 2px 0 0; color: var(--text); font-size: 22px; line-height: 1.2; }
	.eyebrow { color: #6965db; font-size: 10px; font-weight: 750; letter-spacing: 0.1em; text-transform: uppercase; }
	.library-panel > p { margin: 12px 0 18px; color: var(--muted); font-size: 13px; }
	.icon-button { width: 34px; height: 34px; border-radius: 8px; }
	.icon-button:hover { background: var(--button-bg); }

	.library-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
	.library-grid > button {
		padding: 9px;
		border: 1px solid var(--border);
		border-radius: 11px;
		background: color-mix(in srgb, var(--panel-bg) 88%, var(--button-bg));
		color: var(--text);
		cursor: pointer;
		transition: border 120ms ease, transform 120ms ease, box-shadow 120ms ease;
	}

	.library-grid > button:hover {
		border-color: #aaa7ef;
		transform: translateY(-2px);
		box-shadow: 0 8px 18px rgba(43, 40, 100, 0.1);
	}

	.library-grid strong { display: block; margin-top: 7px; font-size: 12px; }
	.library-preview { position: relative; display: block; height: 76px; border-radius: 7px; background: var(--canvas); overflow: hidden; }
	.note-preview { margin: 8px 12px; height: 60px; border: 2px solid #f08c00; background: #ffec99; transform: rotate(-2deg); }
	.note-preview i { display: block; width: 60%; height: 2px; margin: 11px auto -4px; background: #d1a900; }
	.flow-preview i { position: absolute; top: 24px; left: 8px; width: 35px; height: 28px; border: 2px solid #2f9e44; background: #d3f9d8; }
	.flow-preview b { position: absolute; top: 38px; left: 44px; width: 32px; height: 2px; background: #555; }
	.flow-preview b::after { content: ''; position: absolute; right: -1px; top: -4px; border-width: 5px 0 5px 7px; border-style: solid; border-color: transparent transparent transparent #555; }
	.flow-preview em { position: absolute; top: 22px; right: 7px; width: 34px; height: 34px; border: 2px solid #1971c2; background: #a5d8ff; transform: rotate(45deg); }
	.decision-preview i { position: absolute; top: 17px; left: 41px; width: 42px; height: 42px; border: 2px solid #7048e8; background: #eebefa; transform: rotate(45deg); }
	.label-preview { display: flex; align-items: center; justify-content: center; color: var(--text); font-family: Georgia, serif; font-size: 34px; font-weight: 700; }
	.library-tip { display: flex; align-items: center; gap: 7px; margin-top: 18px; padding: 10px; border-radius: 9px; background: var(--button-bg); color: var(--muted); font-size: 11px; }

	.bottom-left,
	.bottom-right {
		position: absolute;
		bottom: 20px;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.bottom-left { left: 16px; }
	.bottom-right { right: 16px; }

	.zoom-controls,
	.history-controls {
		display: flex;
		height: 48px;
		align-items: center;
		padding: 4px;
		border-radius: 11px;
		background: var(--button-bg);
	}

	.zoom-controls button,
	.history-controls button { width: 40px; height: 40px; border-radius: 8px; }
	.zoom-controls button:hover,
	.history-controls button:hover:not(:disabled) { background: var(--button-hover); }
	.zoom-controls .zoom-value { width: 54px; font-variant-numeric: tabular-nums; }
	.history-controls button:disabled { color: var(--faint); cursor: default; opacity: 0.5; }

	.saved-indicator {
		display: flex;
		align-items: center;
		gap: 6px;
		color: #6965db;
		font-size: 11px;
		font-weight: 650;
	}

	.saved-indicator.saving { color: #f08c00; }
	.saved-indicator.error { color: #e03131; }

	.saved-indicator span { opacity: 0; transform: translateX(5px); transition: opacity 120ms ease, transform 120ms ease; }
	.saved-indicator:hover span { opacity: 1; transform: translateX(0); }

	.text-editor {
		position: absolute;
		z-index: 25;
		width: 320px;
		min-height: 48px;
		padding: 0;
		border: 0;
		outline: 1px dashed #6965db;
		background: transparent;
		color: var(--text);
		font-family: 'Comic Sans MS', 'Bradley Hand', cursive !important;
		resize: none;
		user-select: text;
	}

	.hidden-input { display: none; }
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.modal-shell {
		position: absolute;
		inset: 0;
		z-index: 100;
		display: grid;
		place-items: center;
		padding: 20px;
		overflow-y: auto;
	}

	.modal-backdrop {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		border: 0;
		background: rgba(24, 24, 30, 0.35);
		backdrop-filter: blur(3px);
		cursor: default;
	}

	.modal-card {
		position: relative;
		z-index: 1;
		width: min(480px, 100%);
		max-height: calc(100dvh - 40px);
		padding: 30px;
		border: 1px solid var(--border);
		border-radius: 18px;
		background: var(--panel-bg);
		box-shadow: 0 28px 80px rgba(17, 17, 24, 0.25);
		animation: modal-in 160ms ease-out;
		overflow-y: auto;
		user-select: text;
	}

	@keyframes modal-in {
		from { opacity: 0; transform: translateY(8px) scale(0.98); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}

	.modal-close {
		position: absolute;
		top: 14px;
		right: 14px;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		border-radius: 9px;
		background: transparent;
		cursor: pointer;
	}

	.modal-close:hover { background: var(--button-bg); }
	.modal-icon { display: flex; width: 46px; height: 46px; align-items: center; justify-content: center; margin-bottom: 17px; border-radius: 13px; background: var(--active); color: #5f5bc5; }
	.modal-card > p { margin: 12px 0 22px; color: var(--muted); line-height: 1.55; }
	.modal-card > label { display: block; margin-bottom: 7px; color: var(--muted); font-size: 11px; font-weight: 650; }

	.share-link-row { display: flex; gap: 8px; }
	.share-link-row input {
		min-width: 0;
		flex: 1;
		height: 44px;
		padding: 0 12px;
		border: 1px solid var(--border);
		border-radius: 9px;
		outline: none;
		background: var(--canvas);
		color: var(--muted);
		font-size: 12px;
	}

	.share-link-row input:focus { border-color: #8c89e8; box-shadow: 0 0 0 3px rgba(105, 101, 219, 0.12); }
	.share-link-row button {
		display: flex;
		height: 44px;
		align-items: center;
		gap: 6px;
		padding: 0 14px;
		border: 0;
		border-radius: 9px;
		background: var(--button-bg);
		font-weight: 600;
		cursor: pointer;
	}

	.share-link-row button.copied { color: #2f9e44; }
	.primary-modal-button {
		width: 100%;
		height: 46px;
		margin-top: 14px;
		border: 0;
		border-radius: 10px;
		background: #6965db;
		color: white !important;
		font-weight: 650;
		cursor: pointer;
	}

	.modal-card > small { display: block; margin-top: 13px; color: var(--faint); line-height: 1.45; }
	.help-modal { width: min(440px, 100%); }
	.shortcut-list { display: grid; gap: 2px; margin-top: 22px; }
	.shortcut-list > div { display: flex; min-height: 42px; align-items: center; gap: 6px; border-bottom: 1px solid var(--border); }
	.shortcut-list > div:last-child { border: 0; }
	.shortcut-list span { flex: 1; color: var(--muted); }

	.toast {
		position: absolute;
		left: 50%;
		bottom: 24px;
		z-index: 120;
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 15px;
		transform: translateX(-50%);
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--panel-bg);
		box-shadow: 0 10px 32px rgba(20, 20, 25, 0.15);
		font-size: 12px;
		font-weight: 600;
		animation: toast-in 160ms ease-out;
	}

	.toast :global(svg) { color: #2f9e44; }
	@keyframes toast-in {
		from { opacity: 0; transform: translate(-50%, 6px); }
		to { opacity: 1; transform: translate(-50%, 0); }
	}

	@media (max-width: 1180px) {
		.tool-button { width: 39px; }
		.top-toolbar { gap: 1px; }
	}

	@media (max-width: 900px) {
		.top-toolbar {
			top: auto;
			bottom: 76px;
			width: calc(100% - 24px);
			max-width: 650px;
			overflow-x: auto;
			transform: translateX(-50%);
			scrollbar-width: none;
		}
		.top-toolbar::-webkit-scrollbar { display: none; }
		.overflow-menu {
			top: auto;
			right: 12px;
			bottom: 138px;
			left: auto;
		}
		.tool-button { min-width: 42px; }
		.shortcut-number,
		.lock-button,
		.toolbar-separator { display: none; }
		.canvas-hint { top: 82px; width: calc(100% - 40px); text-align: center; white-space: normal; }
		.style-panel { top: 76px; max-height: calc(100% - 238px); overflow: auto; }
		.library-panel { top: 74px; bottom: 140px; }
		.bottom-left { bottom: 16px; }
		.bottom-right { bottom: 16px; }
		.toast { bottom: 136px; }
	}

	@media (max-width: 620px) {
		.square-button { width: 44px; height: 44px; }
		.top-left { top: 12px; left: 12px; }
		.top-actions { top: 12px; right: 12px; gap: 7px; }
		.share-button { height: 44px; padding: 0 14px; }
		.style-panel { left: 12px; width: 218px; }
		.library-panel { top: 66px; right: 10px; bottom: 138px; width: calc(100% - 20px); }
		.saved-indicator { display: none; }
		.bottom-right .square-button { display: none; }
		.zoom-controls { height: 44px; }
		.zoom-controls button { width: 34px; height: 36px; }
		.zoom-controls .zoom-value { width: 48px; }
		.history-controls { display: none; }
		.modal-card { padding: 25px 20px; }
		.share-link-row { align-items: stretch; flex-direction: column; }
		.share-link-row button { justify-content: center; }
	}

	@media (prefers-reduced-motion: reduce) {
		*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
	}
</style>
