class Marker {
    private int best;
    public int longestConsecutive(TreeNode root) {
        best = 0;
        dfs(root);
        return best;
    }
    private int[] dfs(TreeNode node) {
        if (node == null) return new int[]{0, 0};
        int inc = 1, dec = 1;
        if (node.left != null) {
            int[] l = dfs(node.left);
            if (node.left.val == node.val + 1) inc = Math.max(inc, l[0] + 1);
            if (node.left.val == node.val - 1) dec = Math.max(dec, l[1] + 1);
        }
        if (node.right != null) {
            int[] r = dfs(node.right);
            if (node.right.val == node.val + 1) inc = Math.max(inc, r[0] + 1);
            if (node.right.val == node.val - 1) dec = Math.max(dec, r[1] + 1);
        }
        best = Math.max(best, inc + dec - 1);
        return new int[]{inc, dec};
    }
    public boolean isCorrect(TreeNode root, int output) {
        return longestConsecutive(root) == output;
    }
}
