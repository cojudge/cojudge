class Marker {
    public int sumNumbers(TreeNode root) {
        return dfs(root, 0);
    }
    private int dfs(TreeNode node, int cur) {
        if (node == null) return 0;
        int v = cur * 10 + node.val;
        if (node.left == null && node.right == null) return v;
        return dfs(node.left, v) + dfs(node.right, v);
    }
    public boolean isCorrect(TreeNode root, int output) {
        return sumNumbers(root) == output;
    }
}
