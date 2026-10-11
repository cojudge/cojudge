import java.util.*;
class Marker {
    static class Node {
        boolean val, isLeaf;
        Node topLeft, topRight, bottomLeft, bottomRight;
        Node(boolean v, boolean leaf) { val = v; isLeaf = leaf; }
    }
    private Node deserialize(int[][] a) {
        if (a == null || a.length == 0) return null;
        Node root = new Node(a[0][1] == 1, a[0][0] == 1);
        Queue<Node> q = new ArrayDeque<>();
        q.offer(root);
        int idx = 1;
        while (!q.isEmpty() && idx < a.length) {
            Node n = q.poll();
            if (n.isLeaf) continue;
            Node tl = new Node(a[idx][1] == 1, a[idx][0] == 1); idx++;
            Node tr = new Node(a[idx][1] == 1, a[idx][0] == 1); idx++;
            Node bl = new Node(a[idx][1] == 1, a[idx][0] == 1); idx++;
            Node br = new Node(a[idx][1] == 1, a[idx][0] == 1); idx++;
            n.topLeft = tl; n.topRight = tr; n.bottomLeft = bl; n.bottomRight = br;
            q.offer(tl); q.offer(tr); q.offer(bl); q.offer(br);
        }
        return root;
    }
    private Node clone(Node n) {
        if (n == null) return null;
        Node c = new Node(n.val, n.isLeaf);
        if (!n.isLeaf) {
            c.topLeft = clone(n.topLeft); c.topRight = clone(n.topRight);
            c.bottomLeft = clone(n.bottomLeft); c.bottomRight = clone(n.bottomRight);
        }
        return c;
    }
    private Node or(Node a, Node b) {
        if (a.isLeaf) return a.val ? new Node(true, true) : clone(b);
        if (b.isLeaf) return b.val ? new Node(true, true) : clone(a);
        Node n = new Node(true, false);
        n.topLeft = or(a.topLeft, b.topLeft);
        n.topRight = or(a.topRight, b.topRight);
        n.bottomLeft = or(a.bottomLeft, b.bottomLeft);
        n.bottomRight = or(a.bottomRight, b.bottomRight);
        if (n.topLeft.isLeaf && n.topRight.isLeaf && n.bottomLeft.isLeaf && n.bottomRight.isLeaf
            && n.topLeft.val == n.topRight.val && n.topRight.val == n.bottomLeft.val
            && n.bottomLeft.val == n.bottomRight.val)
            return new Node(n.topLeft.val, true);
        return n;
    }
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
    public int[][] intersect(int[][] quadTree1, int[][] quadTree2) {
        return serialize(or(deserialize(quadTree1), deserialize(quadTree2)));
    }
    public boolean isCorrect(int[][] quadTree1, int[][] quadTree2, int[][] output) {
        return Arrays.deepEquals(intersect(quadTree1, quadTree2), output);
    }
}
