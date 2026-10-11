import java.util.*;
class Marker {
    private int best = 0;
    private static class Info {
        boolean bst; int size; long lo; long hi;
        Info(boolean b, int s, long l, long h) { bst = b; size = s; lo = l; hi = h; }
    }
    public int largestBSTSubtree(TreeNode root) {
        best = 0;
        dfs(root);
        return best;
    }
    private Info dfs(TreeNode n) {
        if (n == null) return new Info(true, 0, Long.MAX_VALUE, Long.MIN_VALUE);
        Info l = dfs(n.left);
        Info r = dfs(n.right);
        if (l.bst && r.bst && (long) n.val > l.hi && (long) n.val < r.lo) {
            int sz = l.size + r.size + 1;
            if (sz > best) best = sz;
            long lo = Math.min(n.val, l.lo);
            long hi = Math.max(n.val, r.hi);
            return new Info(true, sz, lo, hi);
        }
        return new Info(false, 0, 0, 0);
    }
    public boolean isCorrect(TreeNode root, int output) {
        return largestBSTSubtree(root) == output;
    }
}
