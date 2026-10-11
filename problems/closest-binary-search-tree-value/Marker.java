import java.util.*;
class Marker {
    public int closestValue(TreeNode root, String target) {
        double t = Double.parseDouble(target);
        int best = root.val;
        double bestDiff = Math.abs(root.val - t);
        TreeNode node = root;
        while (node != null) {
            double diff = Math.abs(node.val - t);
            if (diff < bestDiff - 1e-12 || (Math.abs(diff - bestDiff) <= 1e-12 && node.val < best)) {
                best = node.val;
                bestDiff = diff;
            }
            if (t < node.val) node = node.left;
            else if (t > node.val) node = node.right;
            else break;
        }
        return best;
    }
    public boolean isCorrect(TreeNode root, String target, int output) {
        return closestValue(cloneTree(root), target) == output;
    }
    private TreeNode cloneTree(TreeNode node) {
        if (node == null) return null;
        TreeNode c = new TreeNode(node.val);
        c.left = cloneTree(node.left);
        c.right = cloneTree(node.right);
        return c;
    }
}
