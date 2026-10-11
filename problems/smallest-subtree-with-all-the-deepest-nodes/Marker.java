class Marker {
    public TreeNode subtreeWithAllDeepest(TreeNode root) {
        return helper(root).node;
    }
    private static class Res { TreeNode node; int depth; Res(TreeNode n, int d){node=n;depth=d;} }
    private Res helper(TreeNode n) {
        if (n == null) return new Res(null, 0);
        Res l = helper(n.left), r = helper(n.right);
        if (l.depth == r.depth) return new Res(n, l.depth + 1);
        if (l.depth > r.depth) return new Res(l.node, l.depth + 1);
        return new Res(r.node, r.depth + 1);
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
    public boolean isCorrect(TreeNode root, TreeNode output) {
        return equalTrees(subtreeWithAllDeepest(root), output);
    }
}
