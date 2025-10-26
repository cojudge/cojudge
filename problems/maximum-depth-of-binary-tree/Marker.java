import java.util.*;
class Marker {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    public boolean isCorrect(TreeNode root, int output) {
        return output == maxDepth(root);
    }
}
