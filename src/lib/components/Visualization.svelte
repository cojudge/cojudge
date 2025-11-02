<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  // Public props
  export let visualType: 'tree_node' | 'undirected_edges' | 'matrix' | 'other' = 'tree_node';
  export let data: string = '';
  export let numNodes: number | null = null;

  let containerEl: HTMLDivElement;
  let canvasEl: HTMLCanvasElement;
  let resizeTimer: number | undefined;
  let ro: ResizeObserver | null = null;
  let themeObserver: MutationObserver | null = null;
  let lastObserved = { width: 0, height: 0 };

  // Utilities
  function parseLeetCodeArray(s: string): Array<number|string|null> {
    if (!s) return [];
    s = s.trim();
    if (s.startsWith('[') && s.endsWith(']')) s = s.slice(1, -1);
    if (s === '') return [];
    return s.split(',').map(x => {
      const t = x.trim();
      if (t === 'null' || t === 'None' || t === '') return null;
      const n = Number(t);
      return Number.isFinite(n) ? n : t.replace(/^(["'])|\1$/g,'');
    });
  }

  type NodeT = { val: any; left: NodeT | null; right: NodeT | null } | null;

  function buildTreeFromLevelOrder(arr: any[]): NodeT {
    if (!arr || arr.length === 0) return null;
    const root: any = { val: arr[0], left: null, right: null };
    const queue: any[] = [root];
    let i = 1;
    while (i < arr.length && queue.length) {
      const node: any = queue.shift();
      if (node == null) { continue; }
      if (i < arr.length) {
        const v = arr[i++];
        if (v !== null && v !== undefined) {
          node.left = { val: v, left: null, right: null };
          queue.push(node.left);
        } else {
          node.left = null;
          queue.push(null);
        }
      }
      if (i < arr.length) {
        const v = arr[i++];
        if (v !== null && v !== undefined) {
          node.right = { val: v, left: null, right: null };
          queue.push(node.right);
        } else {
          node.right = null;
          queue.push(null);
        }
      }
    }
    return root;
  }

  function assignPositions(root: any, width: number, levelHeight: number, nodeRadius: number, marginX: number, marginY: number = 30) {
    if (!root) return new Map();
    const positions = new Map<any, {x:number, y:number}>();

    function assignPositionsRecursive(node: any, depth: number, leftBound: number, rightBound: number) {
      if (!node) return;
      const centerX = (leftBound + rightBound) / 2;
      const y = marginY + depth * levelHeight + nodeRadius;
      positions.set(node, { x: centerX, y });

      if (node.left || node.right) {
        if (node.left) assignPositionsRecursive(node.left, depth + 1, leftBound, centerX - nodeRadius);
        if (node.right) assignPositionsRecursive(node.right, depth + 1, centerX + nodeRadius, rightBound);
      }
    }

    const usableWidth = Math.max(10, width - 2 * marginX);
    assignPositionsRecursive(root, 0, marginX, marginX + usableWidth);

    function adjustSingleChildren(node: any) {
      if (!node) return;
      const pos = positions.get(node);
      if (!pos) return;
      const hasLeft = node.left !== null;
      const hasRight = node.right !== null;
      if (hasLeft && !hasRight) {
        const leftPos = positions.get(node.left);
        if (leftPos) pos.x = Math.max(pos.x, leftPos.x + nodeRadius * 1.5);
      } else if (!hasLeft && hasRight) {
        const rightPos = positions.get(node.right);
        if (rightPos) pos.x = Math.min(pos.x, rightPos.x - nodeRadius * 1.5);
      }
      if (node.left) adjustSingleChildren(node.left);
      if (node.right) adjustSingleChildren(node.right);
    }
    adjustSingleChildren(root);

    return positions;
  }

  function drawTreeOnCanvas(root: any, canvas: HTMLCanvasElement, options: any = {}) {
    const ctx = canvas.getContext('2d')!;
    const dpi = (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1;

    const nodeRadius = options.nodeRadius ?? 22;
    const levelHeight = options.levelHeight ?? 80;
    const marginX = options.marginX ?? 30;
    const marginY = options.marginY ?? 30;

    function getTreeDepth(node: any): number {
      if (!node) return 0;
      return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
    }

  const treeDepth = getTreeDepth(root);
  const requiredHeight = Math.max(120, marginY * 2 + treeDepth * levelHeight + nodeRadius * 2);

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 800;
    canvas.style.width = width + 'px';
    canvas.style.height = requiredHeight + 'px';
    canvas.width = Math.max(1, Math.floor(width * dpi));
    canvas.height = Math.max(1, Math.floor(requiredHeight * dpi));

    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpi, dpi);
    ctx.clearRect(0, 0, width, requiredHeight);

    if (!root) return;

    const pos = assignPositions(root, width, levelHeight, nodeRadius, marginX, marginY);

    ctx.lineWidth = 2;
    ctx.strokeStyle = options.edgeColor ?? '#9c8f87';
    ctx.fillStyle = options.nodeColor ?? '#4a3730';
    ctx.font = (options.fontSize ?? 14) + 'px system-ui, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    function drawEdges(node: any) {
      if (!node) return;
      const p = pos.get(node);
      if (node.left) {
        const pl = pos.get(node.left);
        ctx.beginPath();
        ctx.strokeStyle = options.edgeColor ?? '#9c8f87';
        const startX = p.x - nodeRadius * 0.3;
        const startY = p.y + nodeRadius * 0.7;
        const endX = pl.x + nodeRadius * 0.3;
        const endY = pl.y - nodeRadius * 0.7;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        drawEdges(node.left);
      }
      if (node.right) {
        const pr = pos.get(node.right);
        ctx.beginPath();
        ctx.strokeStyle = options.edgeColor ?? '#9c8f87';
        const startX = p.x + nodeRadius * 0.3;
        const startY = p.y + nodeRadius * 0.7;
        const endX = pr.x - nodeRadius * 0.3;
        const endY = pr.y - nodeRadius * 0.7;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        drawEdges(node.right);
      }
    }
    drawEdges(root);

    function drawNode(node: any) {
      if (!node) return;
      const p = pos.get(node);
      ctx.beginPath();
      ctx.fillStyle = options.nodeColor ?? '#4a3730';
      ctx.strokeStyle = options.borderColor ?? '#22c55e';
      ctx.lineWidth = 2;
      ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = options.textColor ?? '#f5efe9';
      ctx.fillText(String(node.val), p.x, p.y);
      if (node.left) drawNode(node.left);
      if (node.right) drawNode(node.right);
    }
    drawNode(root);
  }

  // ===== Undirected edges visualization =====
  type Edge = [string | number, string | number];

  function parseEdgeList(input: string): Edge[] {
    if (!input) return [];
    let s = input.trim();
    if (s === '') return [];
    // Try JSON first (accept single quotes as well)
    try {
      const j = JSON.parse(s.replace(/'/g, '"'));
      if (Array.isArray(j)) {
        const edges: Edge[] = [];
        for (const item of j) {
          if (Array.isArray(item) && item.length >= 2) {
            const a = item[0];
            const b = item[1];
            const toVal = (v: any) => {
              const n = Number(v);
              return Number.isFinite(n) && String(v).trim() !== '' ? n : String(v);
            };
            edges.push([toVal(a), toVal(b)]);
          }
        }
        return edges;
      }
    } catch {}
    // Fallback: match bracketed pairs like [x,y]
    const pairs = s.match(/\[[^\[\]]*\]/g) || [];
    const edges: Edge[] = [];
    for (const p of pairs) {
      const inner = p.slice(1, -1);
      const parts = inner.split(',');
      if (parts.length >= 2) {
        const toVal = (t: string) => {
          const str = t.trim().replace(/^(["'])(.*)\1$/, '$2');
          const n = Number(str);
          return Number.isFinite(n) && str !== '' ? n : str;
        };
        edges.push([toVal(parts[0]), toVal(parts[1])]);
      }
    }
    return edges;
  }

  function drawUndirectedGraphOnCanvas(edgeInput: string, canvas: HTMLCanvasElement, options: any = {}) {
    const edges = parseEdgeList(edgeInput);
    const dpi = (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1;
    const nodeRadius = options.nodeRadius ?? 20;
    const marginX = options.marginX ?? 30;
    const marginY = options.marginY ?? 30;
    const compGap = options.componentGap ?? 60;

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 800;

    // Collect nodes and build adjacency for components
    const nodesSet = new Set<string | number>();
    for (const [a, b] of edges) { nodesSet.add(a); nodesSet.add(b); }
    // Include isolated nodes if numNodes provided (0..numNodes-1)
    if (typeof numNodes === 'number' && Number.isFinite(numNodes) && numNodes > 0) {
      for (let i = 0; i < numNodes; i++) nodesSet.add(i);
    }
    const nodes = Array.from(nodesSet);
    const idIndex = new Map<string | number, number>(nodes.map((n, i) => [n, i] as const));
    const adj: number[][] = Array.from({ length: nodes.length }, () => []);
    for (const [a, b] of edges) {
      const ia = idIndex.get(a)!; const ib = idIndex.get(b)!;
      if (!adj[ia].includes(ib)) adj[ia].push(ib);
      if (!adj[ib].includes(ia)) adj[ib].push(ia);
    }

    // Find connected components
    const comps: number[][] = [];
    const seen = new Array(nodes.length).fill(false);
    for (let i = 0; i < nodes.length; i++) {
      if (seen[i]) continue;
      const q = [i];
      seen[i] = true;
      const comp: number[] = [];
      while (q.length) {
        const v = q.shift()!;
        comp.push(v);
        for (const nb of adj[v]) if (!seen[nb]) { seen[nb] = true; q.push(nb); }
      }
      comps.push(comp);
    }

    // Determine layout per component (circular), stacked vertically
    type Pos = { x: number; y: number };
    const positions = new Map<number, Pos>();

    // Estimate component heights and overall height first
    const compRadii: number[] = [];
    for (const comp of comps) {
      const count = comp.length || 1;
      const desiredSpacing = nodeRadius * 2.2; // arc spacing between centers
      const minR = Math.max(40, nodeRadius * 3);
      const maxR = Math.max(minR, (width - 2 * marginX) / 2 - nodeRadius);
      const R = Math.min(maxR, Math.max(minR, (count * desiredSpacing) / (2 * Math.PI)));
      compRadii.push(R);
    }
    const totalHeight = comps.reduce((acc, _c, i) => acc + (compRadii[i] * 2 + nodeRadius * 2) + (i > 0 ? compGap : marginY) + (i === comps.length - 1 ? marginY : 0), 0);

  const requiredHeight = Math.max(120, totalHeight);

    // Prepare canvas
    canvas.style.width = width + 'px';
    canvas.style.height = requiredHeight + 'px';
    canvas.width = Math.max(1, Math.floor(width * dpi));
    canvas.height = Math.max(1, Math.floor(requiredHeight * dpi));
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpi, dpi);
    ctx.clearRect(0, 0, width, requiredHeight);

    if (nodes.length === 0) return;

    // Compute positions
    let yCursor = marginY + (comps.length > 0 ? compRadii[0] + nodeRadius : 0);
    for (let ci = 0; ci < comps.length; ci++) {
      const comp = comps[ci];
      const R = compRadii[ci];
      const centerX = marginX + (width - 2 * marginX) / 2;
      const centerY = yCursor;
      const count = comp.length;
      if (count === 1) {
        positions.set(comp[0], { x: centerX, y: centerY });
      } else {
        for (let i = 0; i < count; i++) {
          const angle = (2 * Math.PI * i) / count - Math.PI / 2; // start at top
          const x = centerX + R * Math.cos(angle);
          const y = centerY + R * Math.sin(angle);
          positions.set(comp[i], { x, y });
        }
      }
      yCursor += R + nodeRadius + (ci < comps.length - 1 ? compGap + compRadii[ci + 1] + nodeRadius : 0);
    }

    // Draw edges
    ctx.lineWidth = 2;
    ctx.strokeStyle = options.edgeColor ?? '#9c8f87';
    for (const [a, b] of edges) {
      const ia = idIndex.get(a)!; const ib = idIndex.get(b)!;
      const pa = positions.get(ia)!; const pb = positions.get(ib)!;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    }

    // Draw nodes
    ctx.font = (options.fontSize ?? 14) + 'px system-ui, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < nodes.length; i++) {
      const p = positions.get(i)!;
      ctx.beginPath();
      ctx.fillStyle = options.nodeColor ?? '#4a3730';
      ctx.strokeStyle = options.borderColor ?? '#22c55e';
      ctx.lineWidth = 2;
      ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = options.textColor ?? '#f5efe9';
      ctx.fillText(String(nodes[i]), p.x, p.y);
    }
  }

  // ===== Matrix visualization =====
  function parseMatrix(input: string): any[][] {
    if (!input) return [];
    let s = input.trim();
    if (s === '') return [];
    try {
      // Accept single quotes
      const j = JSON.parse(s.replace(/'/g, '"'));
      if (Array.isArray(j)) {
        return j.map((row: any) => Array.isArray(row) ? row : [row]);
      }
    } catch {}
    // Fallback: parse like [[a,b],[c,d]] by extracting bracketed rows
    const rows: any[][] = [];
    const rowMatches = s.match(/\[[^\[\]]*\]/g) || [];
    for (const rm of rowMatches) {
      const inner = rm.slice(1, -1);
      if (inner.trim() === '') { rows.push([]); continue; }
      const parts = inner.split(',');
      const row: any[] = parts.map((t) => {
        const str = t.trim().replace(/^(\"|\')(.*)\1$/, '$2');
        if (str.toLowerCase() === 'null') return null;
        const n = Number(str);
        return Number.isFinite(n) && str !== '' ? n : str;
      });
      rows.push(row);
    }
    return rows;
  }

  function drawMatrixOnCanvas(input: string, canvas: HTMLCanvasElement, options: any = {}) {
    const mat = parseMatrix(input);
    const rows = mat.length;
    const cols = rows > 0 ? Math.max(...mat.map(r => r.length)) : 0;
    const dpi = (typeof window !== 'undefined' ? window.devicePixelRatio : 1) || 1;
    const marginX = options.marginX ?? 30;
    const marginY = options.marginY ?? 30;
    const cellGap = options.cellGap ?? 6;
    const minCell = options.minCellSize ?? 28;
    const maxCell = options.maxCellSize ?? 44;

    const width = canvas.parentElement ? canvas.parentElement.clientWidth : 800;

    if (rows === 0 || cols === 0) {
      // Clear
      canvas.style.width = width + 'px';
      canvas.style.height = 80 + 'px';
      canvas.width = Math.max(1, Math.floor(width * dpi));
      canvas.height = Math.max(1, Math.floor(80 * dpi));
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.scale(dpi, dpi);
      ctx.clearRect(0, 0, width, 80);
      return;
    }

    // Compute cell size to fit within width
    const usableWidth = Math.max(10, width - 2 * marginX - (cols - 1) * cellGap);
    const cellSizeFit = Math.floor(usableWidth / cols);
    const cellSize = Math.max(minCell, Math.min(maxCell, cellSizeFit));
    const gridWidth = cols * cellSize + (cols - 1) * cellGap;
    const gridHeight = rows * cellSize + (rows - 1) * cellGap;
  const requiredHeight = Math.max(100, gridHeight + 2 * marginY);

    // Prepare canvas
    canvas.style.width = width + 'px';
    canvas.style.height = requiredHeight + 'px';
    canvas.width = Math.max(1, Math.floor(width * dpi));
    canvas.height = Math.max(1, Math.floor(requiredHeight * dpi));
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpi, dpi);
    ctx.clearRect(0, 0, width, requiredHeight);

    // Colors and font
    ctx.font = (options.fontSize ?? 14) + 'px system-ui, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const leftX = marginX + (width - 2 * marginX - gridWidth) / 2; // center horizontally
    const topY = marginY;

    // Draw cells
    for (let r = 0; r < rows; r++) {
      const row = mat[r] || [];
      for (let c = 0; c < cols; c++) {
        const x = leftX + c * (cellSize + cellGap);
        const y = topY + r * (cellSize + cellGap);
        const val = c < row.length ? row[c] : '';

        // Cell background
        ctx.fillStyle = options.nodeColor ?? '#4a3730';
        const radius = Math.min(10, cellSize * 0.2);
        // rounded rect
        const rx = radius, ry = radius;
        ctx.beginPath();
        ctx.moveTo(x + rx, y);
        ctx.lineTo(x + cellSize - rx, y);
        ctx.quadraticCurveTo(x + cellSize, y, x + cellSize, y + ry);
        ctx.lineTo(x + cellSize, y + cellSize - ry);
        ctx.quadraticCurveTo(x + cellSize, y + cellSize, x + cellSize - rx, y + cellSize);
        ctx.lineTo(x + rx, y + cellSize);
        ctx.quadraticCurveTo(x, y + cellSize, x, y + cellSize - ry);
        ctx.lineTo(x, y + ry);
        ctx.quadraticCurveTo(x, y, x + rx, y);
        ctx.closePath();
        ctx.fill();

        // Border
        ctx.lineWidth = 2;
        ctx.strokeStyle = options.borderColor ?? '#22c55e';
        ctx.stroke();

        // Text
        ctx.fillStyle = options.textColor ?? '#f5efe9';
        const text = val === null || val === undefined ? '' : String(val);
        ctx.fillText(text, x + cellSize / 2, y + cellSize / 2);
      }
    }
  }

  function visualizeLeetCodeTree(inputString: string, canvas: HTMLCanvasElement, options: any = {}) {
    const arr = parseLeetCodeArray(inputString);
    if (arr.length === 0) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      return null;
    }
    const root = buildTreeFromLevelOrder(arr);
    drawTreeOnCanvas(root, canvas, options);
    return root;
  }

  function themeColors() {
    const css = getComputedStyle(document.documentElement);
    const pick = (key: string, fallback: string) => {
      const value = css.getPropertyValue(key).trim();
      return value || fallback;
    };
    return {
      nodeColor: pick('--visual-surface-2', '#4a3730'),
      borderColor: pick('--visual-accent', '#22c55e'),
      edgeColor: pick('--visual-edge', '#9c8f87'),
      textColor: pick('--visual-text', '#f5efe9'),
    };
  }

  function drawNow() {
    if (!canvasEl) return;
    if (visualType === 'tree_node') {
      const colors = themeColors();
      visualizeLeetCodeTree(data, canvasEl, {
        nodeRadius: 18,
        levelHeight: 44,
        marginX: 30,
        marginY: 16,
        ...colors
      });
    } else if (visualType === 'undirected_edges') {
      const colors = themeColors();
      drawUndirectedGraphOnCanvas(data, canvasEl, {
        nodeRadius: 18,
        marginX: 30,
        marginY: 16,
        componentGap: 40,
        ...colors
      });
    } else if (visualType === 'matrix') {
      const colors = themeColors();
      drawMatrixOnCanvas(data, canvasEl, {
        marginX: 30,
        marginY: 16,
        cellGap: 6,
        minCellSize: 22,
        maxCellSize: 36,
        ...colors
      });
    }
  }

  function scheduleDraw() {
    clearTimeout(resizeTimer);
    // @ts-ignore - window.setTimeout typing
    resizeTimer = setTimeout(() => drawNow(), 120) as unknown as number;
  }

  onMount(() => {
    drawNow();

    const onResize = () => scheduleDraw();
    window.addEventListener('resize', onResize);

    // Observe the canvas container size; redraw when it changes
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          // Only schedule a redraw if size actually changed (prevents loops)
          const w = Math.floor(cr.width);
          const h = Math.floor(cr.height);
          if (w !== lastObserved.width || h !== lastObserved.height) {
            lastObserved = { width: w, height: h };
            scheduleDraw();
          }
        }
      });
      if (containerEl) ro.observe(containerEl);
    }

    if (typeof MutationObserver !== 'undefined') {
      themeObserver = new MutationObserver(() => scheduleDraw());
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (ro) { ro.disconnect(); ro = null; }
      if (resizeTimer) { clearTimeout(resizeTimer); }
      if (themeObserver) { themeObserver.disconnect(); themeObserver = null; }
    };
  });

  $: if (visualType === 'tree_node' || visualType === 'undirected_edges' || visualType === 'matrix') { scheduleDraw(); }
  $: if (data != null) { scheduleDraw(); }
</script>

{#if visualType === 'tree_node' || visualType === 'undirected_edges' || visualType === 'matrix'}
  <div class="canvas-container" bind:this={containerEl}>
    <canvas bind:this={canvasEl}></canvas>
  </div>
{:else}
  <div class="other">
    <pre>{data}</pre>
  </div>
{/if}

<style>
  :global(:root) {
    --visual-bg: #2f231e;
    --visual-surface: #3a2a24;
    --visual-surface-2: #4a3730;
    --visual-border: #5a463f;
    --visual-text: #f5efe9;
    --visual-text-dim: #d8cfc8;
    --visual-edge: #9c8f87;
    --visual-accent: #22c55e;
    --visual-accent-strong: #16a34a;
    --visual-shadow: 0 8px 24px rgba(0,0,0,0.35);
  }

  :global(:root[data-theme='light']) {
    --visual-bg: #f7f3ed;
    --visual-surface: #ffffff;
    --visual-surface-2: #f3e5d5;
    --visual-border: rgba(212, 143, 67, 0.35);
    --visual-text: #1f2937;
    --visual-text-dim: #64748b;
    --visual-edge: rgba(212, 143, 67, 0.5);
    --visual-accent: #d48f43;
    --visual-accent-strong: #b15c1c;
    --visual-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  }

  .canvas-container {
    border: 1px solid var(--visual-border);
    width: 100%;
    max-height: 70vh;
    overflow: auto;
    background: var(--visual-surface);
    border-radius: 16px;
    box-shadow: var(--visual-shadow);
  }

  canvas {
    display: block;
    width: 100%;
    height: auto;
    background: transparent;
  }

  .other {
    color: var(--visual-text);
    background: var(--visual-surface);
    border: 1px solid var(--visual-border);
    border-radius: 12px;
    padding: 12px;
    max-height: 70vh;
    overflow: auto;
  }

  .other pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-word;
    color: inherit;
  }
</style>
