import java.util.*;
class Marker {
    public TreeNode addOneRow(TreeNode root, int val, int depth) {
        if (depth == 1) {
            TreeNode n = new TreeNode(val);
            n.left = root;
            return n;
        }
        Queue<TreeNode> q = new LinkedList<>();
        if (root != null) q.add(root);
        int cur = 1;
        while (!q.isEmpty() && cur < depth - 1) {
            int sz = q.size();
            for (int i = 0; i < sz; i++) {
                TreeNode n = q.poll();
                if (n.left != null) q.add(n.left);
                if (n.right != null) q.add(n.right);
            }
            cur++;
        }
        while (!q.isEmpty()) {
            TreeNode n = q.poll();
            TreeNode oldLeft = n.left, oldRight = n.right;
            TreeNode nl = new TreeNode(val), nr = new TreeNode(val);
            nl.left = oldLeft; nr.right = oldRight;
            n.left = nl; n.right = nr;
        }
        return root;
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
    private TreeNode clone(TreeNode t) {
        if (t == null) return null;
        TreeNode n = new TreeNode(t.val);
        n.left = clone(t.left); n.right = clone(t.right);
        return n;
    }
    public boolean isCorrect(TreeNode root, int val, int depth, TreeNode output) {
        return equalTrees(addOneRow(clone(root), val, depth), output);
    }
}
