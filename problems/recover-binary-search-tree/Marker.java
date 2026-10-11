import java.util.*;
class Marker {
    private TreeNode first = null, second = null, prev = null;
    public TreeNode recoverTree(TreeNode root) {
        first = null; second = null; prev = null;
        inorder(root);
        if (first != null && second != null) {
            int t = first.val; first.val = second.val; second.val = t;
        }
        return root;
    }
    private void inorder(TreeNode n) {
        if (n == null) return;
        inorder(n.left);
        if (prev != null && prev.val > n.val) {
            if (first == null) first = prev;
            second = n;
        }
        prev = n;
        inorder(n.right);
    }
    private TreeNode cloneTree(TreeNode n) {
        if (n == null) return null;
        TreeNode c = new TreeNode(n.val);
        c.left = cloneTree(n.left);
        c.right = cloneTree(n.right);
        return c;
    }
    private boolean isSame(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (a.val != b.val) return false;
        return isSame(a.left, b.left) && isSame(a.right, b.right);
    }
    public boolean isCorrect(TreeNode root, TreeNode output) {
        TreeNode expected = recoverTree(cloneTree(root));
        return isSame(expected, output);
    }
}
