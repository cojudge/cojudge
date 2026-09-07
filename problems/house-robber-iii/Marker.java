import java.util.*;
class Marker {
    public int rob(TreeNode root) {
        int[] res = dfs(root);
        return Math.max(res[0], res[1]);
    }
    // [rob, skip]
    private int[] dfs(TreeNode n) {
        if (n == null) return new int[]{0, 0};
        int[] L = dfs(n.left), R = dfs(n.right);
        int rob = n.val + L[1] + R[1];
        int skip = Math.max(L[0], L[1]) + Math.max(R[0], R[1]);
        return new int[]{rob, skip};
    }
    public boolean isCorrect(TreeNode root, int output) {
        return rob(root) == output;
    }
}
