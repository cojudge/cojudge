import java.util.*;
class Marker {
    private int acc;
    public TreeNode convertBST(TreeNode root) {
        acc = 0;
        walk(root);
        return root;
    }
    private void walk(TreeNode node) {
        if (node == null) return;
        walk(node.right);
        acc += node.val;
        node.val = acc;
        walk(node.left);
    }
    private TreeNode clone(TreeNode node) {
        if (node == null) return null;
        TreeNode c = new TreeNode(node.val);
        c.left = clone(node.left);
        c.right = clone(node.right);
        return c;
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
    public boolean isCorrect(TreeNode root, TreeNode output) {
        return equalTrees(convertBST(clone(root)), output);
    }
}
