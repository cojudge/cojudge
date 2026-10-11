import java.util.*;
class Marker {
    private boolean found;
    public boolean checkEqualTree(TreeNode root) {
        if (root == null) return false;
        int total = sum(root);
        if (total % 2 != 0) return false;
        found = false;
        check(root, total, true);
        return found;
    }
    private int sum(TreeNode n) {
        if (n == null) return 0;
        return n.val + sum(n.left) + sum(n.right);
    }
    private int check(TreeNode n, int total, boolean isRoot) {
        if (n == null) return 0;
        int s = n.val + check(n.left, total, false) + check(n.right, total, false);
        if (!isRoot && s == total / 2) found = true;
        return s;
    }
    public boolean isCorrect(TreeNode root, boolean output) {
        // rebuild logic correctly (use check pass)
        if (root == null) return output == false;
        int total = sum(root);
        boolean exp;
        if (total % 2 != 0) exp = false;
        else { found = false; check(root, total, true); exp = found; }
        return output == exp;
    }
}
