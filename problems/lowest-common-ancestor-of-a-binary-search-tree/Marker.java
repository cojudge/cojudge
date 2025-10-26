class Marker {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        while (root != null) {
            if (p.val > root.val && q.val > root.val) {
                root = root.right;
            } else if (p.val < root.val && q.val < root.val) {
                root = root.left;
            } else {
                return root;
            }
        }
        return null;
    }

    private boolean sameTree(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && sameTree(a.left, b.left) && sameTree(a.right, b.right);
    }

    public boolean isCorrect(TreeNode root, TreeNode p, TreeNode q, TreeNode output) {
        TreeNode ans = lowestCommonAncestor(root, p, q);
        return sameTree(ans, output);
    }
}
