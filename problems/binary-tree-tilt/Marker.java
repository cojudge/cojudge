import java.util.*;
class Marker {
    private int total = 0;
    private int dfs(TreeNode n) {
        if (n == null) return 0;
        int l = dfs(n.left), r = dfs(n.right);
        total += Math.abs(l - r);
        return n.val + l + r;
    }
    public int findTilt(TreeNode root) {
        total = 0;
        dfs(root);
        return total;
    }
    public boolean isCorrect(TreeNode root, int output) {
        return output == findTilt(root);
    }
}
