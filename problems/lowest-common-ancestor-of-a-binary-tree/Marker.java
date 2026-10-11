class Marker {
    public TreeNode lowestCommonAncestor(TreeNode root, int p, int q) {
        if (root == null || root.val == p || root.val == q) return root;
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }

    private boolean sameTree(TreeNode a, TreeNode b) {
        if (a == null || b == null) return a == b;
        return a.val == b.val && sameTree(a.left, b.left) && sameTree(a.right, b.right);
    }

    public boolean isCorrect(TreeNode root, int p, int q, TreeNode output) {
        return sameTree(lowestCommonAncestor(root, p, q), output);
    }
}
