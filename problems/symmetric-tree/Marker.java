import java.util.*;
class Marker {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) return true;
        return mirror(root.left, root.right);
    }
    private boolean mirror(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (a.val != b.val) return false;
        return mirror(a.left, b.right) && mirror(a.right, b.left);
    }
    public boolean isCorrect(TreeNode root, boolean output) {
        return output == isSymmetric(root);
    }
}
