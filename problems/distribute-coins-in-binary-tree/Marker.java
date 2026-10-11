import java.util.*;
class Marker {
    private int moves;
    public int distributeCoins(TreeNode root) {
        moves = 0;
        balance(root);
        return moves;
    }
    private int balance(TreeNode node) {
        if (node == null) return 0;
        int left = balance(node.left);
        int right = balance(node.right);
        moves += Math.abs(left) + Math.abs(right);
        return node.val - 1 + left + right;
    }
    public boolean isCorrect(TreeNode root, int output) {
        return distributeCoins(root) == output;
    }
}
