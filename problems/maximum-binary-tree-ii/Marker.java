class Marker {
    public TreeNode insertIntoMaxTree(TreeNode root, int val) {
        if (root == null) {
            return new TreeNode(val);
        }
        if (val > root.val) {
            TreeNode n = new TreeNode(val);
            n.left = root;
            return n;
        }
        root.right = insertIntoMaxTree(root.right, val);
        return root;
    }
    public boolean isCorrect(TreeNode root, int val, TreeNode output) {
        return equalTrees(insertIntoMaxTree(root, val), output);
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
}
