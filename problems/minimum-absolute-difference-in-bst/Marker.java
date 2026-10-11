import java.util.*;
class Marker {
    private int best;
    private Integer prev;
    public int getMinimumDifference(TreeNode root) {
        best = Integer.MAX_VALUE;
        prev = null;
        inorder(root);
        return best;
    }
    private void inorder(TreeNode node) {
        if (node == null) return;
        inorder(node.left);
        if (prev != null) best = Math.min(best, node.val - prev);
        prev = node.val;
        inorder(node.right);
    }
    public boolean isCorrect(TreeNode root, int output) {
        return getMinimumDifference(root) == output;
    }
}
