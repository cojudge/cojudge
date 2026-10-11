import java.util.*;
class Marker {
    private int best;
    public int longestUnivaluePath(TreeNode root) {
        best = 0;
        dfs(root);
        return best;
    }
    private int dfs(TreeNode node) {
        if (node == null) return 0;
        int left = dfs(node.left);
        int right = dfs(node.right);
        int leftArm = (node.left != null && node.left.val == node.val) ? left + 1 : 0;
        int rightArm = (node.right != null && node.right.val == node.val) ? right + 1 : 0;
        best = Math.max(best, leftArm + rightArm);
        return Math.max(leftArm, rightArm);
    }
    public boolean isCorrect(TreeNode root, int output) {
        return longestUnivaluePath(cloneTree(root)) == output;
    }
    private TreeNode cloneTree(TreeNode n) {
        if (n == null) return null;
        TreeNode c = new TreeNode(n.val);
        c.left = cloneTree(n.left);
        c.right = cloneTree(n.right);
        return c;
    }
}
