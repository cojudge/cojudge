import java.util.*;
class Marker {
    public TreeNode flatten(TreeNode root) {
        if (root == null) return null;
        List<Integer> pre = new ArrayList<>();
        preorder(root, pre);
        TreeNode cur = root;
        // rebuild as right chain reusing existing nodes where possible; simplest: rewrite values/links
        cur.left = null;
        TreeNode p = cur;
        p.val = pre.get(0);
        for (int i = 1; i < pre.size(); i++) {
            p.right = new TreeNode(pre.get(i));
            p = p.right;
        }
        // ensure left nulls along chain
        TreeNode q = cur;
        while (q != null) { q.left = null; q = q.right; }
        return cur;
    }
    private void preorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        out.add(n.val);
        preorder(n.left, out);
        preorder(n.right, out);
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
    private boolean isFlattened(TreeNode n, List<Integer> pre) {
        int i = 0;
        TreeNode cur = n;
        while (cur != null) {
            if (cur.left != null) return false;
            if (i >= pre.size() || cur.val != pre.get(i)) return false;
            i++;
            cur = cur.right;
        }
        return i == pre.size();
    }
    public boolean isCorrect(TreeNode root, TreeNode output) {
        List<Integer> pre = new ArrayList<>();
        preorder(root, pre);
        if (pre.isEmpty()) return output == null;
        if (output == null) return false;
        return isFlattened(output, pre);
    }
}
