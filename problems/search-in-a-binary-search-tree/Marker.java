import java.util.*;
class Marker {
    public TreeNode searchBST(TreeNode root, int val) {
        TreeNode cur = root;
        while (cur != null) {
            if (val == cur.val) return cur;
            else if (val < cur.val) cur = cur.left;
            else cur = cur.right;
        }
        return null;
    }
    public boolean isCorrect(TreeNode root, int val, TreeNode output) {
        TreeNode expected = searchBST(cloneTree(root), val);
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
