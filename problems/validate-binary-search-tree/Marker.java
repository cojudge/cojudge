class Marker {
    public boolean isValidBST(TreeNode root) {
        return isValid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean isValid(TreeNode node, long low, long high) {
        if (node == null) return true;
        if (node.val <= low || node.val >= high) return false;
        return isValid(node.left, low, node.val) && isValid(node.right, node.val, high);
    }

    public boolean isCorrect(TreeNode root, boolean output) {
        return output == isValidBST(root);
    }
}
