import java.util.*;
class Marker {
    public int rangeSumBST(TreeNode root, int low, int high) {
        if (root == null) return 0;
        int sum = 0;
        if (root.val >= low && root.val <= high) sum += root.val;
        if (root.val > low) sum += rangeSumBST(root.left, low, high);
        if (root.val < high) sum += rangeSumBST(root.right, low, high);
        return sum;
    }
    public boolean isCorrect(TreeNode root, int low, int high, int output) {
        return rangeSumBST(root, low, high) == output;
    }
}
