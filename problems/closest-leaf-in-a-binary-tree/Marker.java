import java.util.*;
class Marker {
    private TreeNode targetNode = null;
    public int findClosestLeaf(TreeNode root, int k) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        targetNode = null;
        buildParent(root, null, parent, k);
        if (targetNode == null) return -1;
        Queue<TreeNode> q = new LinkedList<>();
        Set<TreeNode> vis = new HashSet<>();
        q.add(targetNode);
        vis.add(targetNode);
        while (!q.isEmpty()) {
            TreeNode cur = q.poll();
            if (cur.left == null && cur.right == null) return cur.val;
            TreeNode p = parent.get(cur);
            if (p != null && !vis.contains(p)) { vis.add(p); q.add(p); }
            if (cur.left != null && !vis.contains(cur.left)) { vis.add(cur.left); q.add(cur.left); }
            if (cur.right != null && !vis.contains(cur.right)) { vis.add(cur.right); q.add(cur.right); }
        }
        return -1;
    }
    private void buildParent(TreeNode node, TreeNode par, Map<TreeNode, TreeNode> parent, int k) {
        if (node == null) return;
        parent.put(node, par);
        if (node.val == k) targetNode = node;
        buildParent(node.left, node, parent, k);
        buildParent(node.right, node, parent, k);
    }
    public boolean isCorrect(TreeNode root, int k, int output) {
        // Accept any leaf at minimal distance from k.
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        List<TreeNode> all = new ArrayList<>();
        TreeNode[] tgt = new TreeNode[1];
        collect(root, null, parent, all, k, tgt);
        if (tgt[0] == null) return false;
        // check output is a leaf value in tree
        boolean isLeaf = false;
        for (TreeNode n : all) {
            if (n.val == output && n.left == null && n.right == null) { isLeaf = true; break; }
        }
        if (!isLeaf) return false;
        int dOut = distance(tgt[0], output, parent, all);
        int best = Integer.MAX_VALUE;
        for (TreeNode n : all) {
            if (n.left == null && n.right == null) {
                best = Math.min(best, distance(tgt[0], n.val, parent, all));
            }
        }
        return dOut == best;
    }
    private void collect(TreeNode node, TreeNode par, Map<TreeNode, TreeNode> parent, List<TreeNode> all, int k, TreeNode[] tgt) {
        if (node == null) return;
        parent.put(node, par);
        all.add(node);
        if (node.val == k) tgt[0] = node;
        collect(node.left, node, parent, all, k, tgt);
        collect(node.right, node, parent, all, k, tgt);
    }
    private int distance(TreeNode from, int targetVal, Map<TreeNode, TreeNode> parent, List<TreeNode> all) {
        Map<Integer, TreeNode> byVal = new HashMap<>();
        for (TreeNode n : all) byVal.put(n.val, n);
        TreeNode tgt = byVal.get(targetVal);
        if (tgt == null) return Integer.MAX_VALUE;
        Queue<TreeNode> q = new LinkedList<>();
        Map<TreeNode, Integer> dist = new HashMap<>();
        q.add(from); dist.put(from, 0);
        while (!q.isEmpty()) {
            TreeNode cur = q.poll();
            int d = dist.get(cur);
            if (cur == tgt) return d;
            List<TreeNode> nxt = new ArrayList<>();
            if (parent.get(cur) != null) nxt.add(parent.get(cur));
            if (cur.left != null) nxt.add(cur.left);
            if (cur.right != null) nxt.add(cur.right);
            for (TreeNode nb : nxt) if (!dist.containsKey(nb)) { dist.put(nb, d + 1); q.add(nb); }
        }
        return Integer.MAX_VALUE;
    }
}
