class Marker {
    private int best;
    public int longestConsecutive(TreeNode root) {
        best = 0;
        dfs(root, null, 0);
        return best;
    }
    private void dfs(TreeNode node, Integer parentVal, int len) {
        if (node == null) return;
        int cur = (parentVal != null && node.val == parentVal + 1) ? len + 1 : 1;
        if (cur > best) best = cur;
        dfs(node.left, node.val, cur);
        dfs(node.right, node.val, cur);
    }
    public boolean isCorrect(TreeNode root, int output) {
        return longestConsecutive(root) == output;
    }
}
