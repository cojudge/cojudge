import java.util.*;
class Marker {
    public TreeNode increasingBST(TreeNode root) {
        List<Integer> vals = new ArrayList<>();
        inorder(root, vals);
        TreeNode dummy = new TreeNode(0);
        TreeNode cur = dummy;
        for (int v : vals) {
            cur.right = new TreeNode(v);
            cur = cur.right;
        }
        return dummy.right;
    }
    private void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);
        inorder(node.right, out);
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
    public boolean isCorrect(TreeNode root, TreeNode output) {
        return equalTrees(increasingBST(root), output);
    }
}
