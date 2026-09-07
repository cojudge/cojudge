import java.util.*;
class Marker {
    static class Node {
        boolean val, isLeaf;
        Node topLeft, topRight, bottomLeft, bottomRight;
        Node(boolean v, boolean leaf) { val = v; isLeaf = leaf; }
    }
    public int[][] construct(int[][] grid) {
        Node root = build(grid, 0, 0, grid.length);
        return serialize(root);
    }
    private Node build(int[][] g, int r, int c, int len) {
        if (len == 1) return new Node(g[r][c] == 1, true);
        int half = len / 2;
        Node tl = build(g, r, c, half);
        Node tr = build(g, r, c + half, half);
        Node bl = build(g, r + half, c, half);
        Node br = build(g, r + half, c + half, half);
        if (tl.isLeaf && tr.isLeaf && bl.isLeaf && br.isLeaf
            && tl.val == tr.val && tr.val == bl.val && bl.val == br.val) {
            return new Node(tl.val, true);
        }
        Node n = new Node(true, false);
        n.topLeft = tl; n.topRight = tr; n.bottomLeft = bl; n.bottomRight = br;
        return n;
    }
    // LeetCode-style BFS serialization with nulls for missing children of non-leaves only... 
    // Actually LeetCode includes nulls. We'll use: BFS queue; for each non-null node emit [isLeaf,val];
    // if not leaf, enqueue 4 children; if leaf, no children. No null tokens — matches common OJ compact form.
    private int[][] serialize(Node root) {
        if (root == null) return new int[0][];
        List<int[]> list = new ArrayList<>();
        Queue<Node> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            Node n = q.poll();
            list.add(new int[]{n.isLeaf ? 1 : 0, n.val ? 1 : 0});
            if (!n.isLeaf) {
                q.offer(n.topLeft); q.offer(n.topRight);
                q.offer(n.bottomLeft); q.offer(n.bottomRight);
            }
        }
        return list.toArray(new int[0][]);
    }
    public boolean isCorrect(int[][] grid, int[][] output) {
        int[][] exp = construct(grid);
        return Arrays.deepEquals(exp, output);
    }
}
