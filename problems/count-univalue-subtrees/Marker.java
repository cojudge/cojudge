class Marker {
    private int count;

    public int countUnivalSubtrees(TreeNode root) {
        count = 0;
        isUnival(root);
        return count;
    }

    private boolean isUnival(TreeNode node) {
        if (node == null) return true;
        boolean left = isUnival(node.left);
        boolean right = isUnival(node.right);
        if (!left || !right) return false;
        if (node.left != null && node.left.val != node.val) return false;
        if (node.right != null && node.right.val != node.val) return false;
        count++;
        return true;
    }

    public boolean isCorrect(TreeNode root, int output) {
        return output == countUnivalSubtrees(root);
    }
}
