import java.util.*;
class Marker {
    public TreeNode sortedListToBST(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
        return build(vals, 0, vals.size() - 1);
    }
    private TreeNode build(List<Integer> a, int l, int r) {
        if (l > r) return null;
        int m = l + (r - l) / 2;
        TreeNode n = new TreeNode(a.get(m));
        n.left = build(a, l, m - 1);
        n.right = build(a, m + 1, r);
        return n;
    }
    private void inorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out);
        out.add(n.val);
        inorder(n.right, out);
    }
    private int height(TreeNode n) {
        if (n == null) return 0;
        int l = height(n.left), r = height(n.right);
        if (l < 0 || r < 0 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }
    private boolean isBST(TreeNode n, long lo, long hi) {
        if (n == null) return true;
        if (n.val <= lo || n.val >= hi) {
            // allow duplicates? LC says sorted ascending, may contain dup? use non-decreasing: allow equal on one side
            // Strict check would reject dups; fall back to multiset+balance only if dups present
            if (!(n.val > lo && n.val < hi)) {
                // permit duplicates by relaxing: only check inorder sorted below
            }
            if (n.val <= lo || n.val >= hi) {
                // keep strict for distinct case
            }
        }
        if (n.val <= lo || n.val >= hi) {
            // check if duplicates exist in tree; if so skip strict BST and rely on inorder equality
            return isBST(n.left, lo, n.val) && isBST(n.right, n.val, hi);
        }
        return isBST(n.left, lo, n.val) && isBST(n.right, n.val, hi);
    }
    public boolean isCorrect(ListNode head, TreeNode output) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
        if (output == null) return vals.isEmpty();
        List<Integer> got = new ArrayList<>();
        inorder(output, got);
        if (got.size() != vals.size()) return false;
        for (int i = 0; i < vals.size(); i++) if (!got.get(i).equals(vals.get(i))) return false;
        if (height(output) < 0) return false;
        // BST check skipped for duplicate values (inorder equality + balance suffice)
        Set<Integer> uniq = new HashSet<>(vals);
        if (uniq.size() == vals.size()) {
            if (!isBST(output, Long.MIN_VALUE, Long.MAX_VALUE)) return false;
        }
        return true;
    }
}
