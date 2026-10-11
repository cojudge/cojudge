class Marker {
    public TreeNode upsideDownBinaryTree(TreeNode root) {
        TreeNode curr = root, prev = null, prevRight = null;
        while (curr != null) {
            TreeNode next = curr.left;
            TreeNode right = curr.right;
            curr.left = prevRight;
            curr.right = prev;
            prev = curr;
            prevRight = right;
            curr = next;
        }
        return prev;
    }

    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }

    public boolean isCorrect(TreeNode root, TreeNode output) {
        return equalTrees(upsideDownBinaryTree(root), output);
    }
}
