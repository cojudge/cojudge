import java.util.*;
class Marker {
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        if (root1 == null) return clone(root2);
        if (root2 == null) return clone(root1);
        TreeNode n = new TreeNode(root1.val + root2.val);
        n.left = mergeTrees(root1.left, root2.left);
        n.right = mergeTrees(root1.right, root2.right);
        return n;
    }
    private TreeNode clone(TreeNode t) {
        if (t == null) return null;
        TreeNode n = new TreeNode(t.val);
        n.left = clone(t.left);
        n.right = clone(t.right);
        return n;
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
    public boolean isCorrect(TreeNode root1, TreeNode root2, TreeNode output) {
        return equalTrees(mergeTrees(clone(root1), clone(root2)), output);
    }
}
