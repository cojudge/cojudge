import java.util.*;
class Marker {
    public TreeNode removeLeafNodes(TreeNode root, int target) {
        if (root == null) return null;
        root.left = removeLeafNodes(root.left, target);
        root.right = removeLeafNodes(root.right, target);
        if (root.left == null && root.right == null && root.val == target) return null;
        return root;
    }
    public boolean isCorrect(TreeNode root, int target, TreeNode output) {
        TreeNode expected = removeLeafNodes(cloneTree(root), target);
        return equalTrees(expected, output);
    }
    private TreeNode cloneTree(TreeNode n) {
        if (n == null) return null;
        TreeNode c = new TreeNode(n.val);
        c.left = cloneTree(n.left);
        c.right = cloneTree(n.right);
        return c;
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
}
