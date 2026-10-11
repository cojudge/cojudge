import java.util.*;
class Marker {
    public int sumOfLeftLeaves(TreeNode root) {
        return dfs(root, false);
    }
    private int dfs(TreeNode n, boolean isLeft) {
        if (n == null) return 0;
        if (n.left == null && n.right == null) return isLeft ? n.val : 0;
        return dfs(n.left, true) + dfs(n.right, false);
    }
    public boolean isCorrect(TreeNode root, int output) {
        return sumOfLeftLeaves(root) == output;
    }
}
