import java.util.*;
class Marker {
    public boolean hasPathSum(TreeNode root, int targetSum) {
        if (root == null) return false;
        if (root.left == null && root.right == null) return root.val == targetSum;
        return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);
    }
    public boolean isCorrect(TreeNode root, int targetSum, boolean output) {
        return output == hasPathSum(root, targetSum);
    }
}
