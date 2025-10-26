class Marker {
    private int best;

    public int maxPathSum(TreeNode root) {
        best = Integer.MIN_VALUE;
        dfs(root);
        return best;
    }

    private int dfs(TreeNode node) {
        if (node == null) return 0;
        int leftGain = Math.max(0, dfs(node.left));
        int rightGain = Math.max(0, dfs(node.right));
        best = Math.max(best, node.val + leftGain + rightGain);
        return node.val + Math.max(leftGain, rightGain);
    }

    public boolean isCorrect(TreeNode root, int output) {
        return output == maxPathSum(root);
    }
}
