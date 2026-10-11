import java.util.*;
class Marker {
    public List<Integer> closestKValues(TreeNode root, String target, int k) {
        double t = Double.parseDouble(target);
        List<Integer> vals = new ArrayList<>();
        inorder(root, vals);
        vals.sort((a, b) -> {
            double da = Math.abs(a - t);
            double db = Math.abs(b - t);
            if (Math.abs(da - db) > 1e-12) return Double.compare(da, db);
            return Integer.compare(a, b);
        });
        return new ArrayList<>(vals.subList(0, k));
    }
    private void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);
        inorder(node.right, out);
    }
    public boolean isCorrect(TreeNode root, String target, int k, List<Integer> output) {
        if (output == null || output.size() != k) return false;
        double t;
        try {
            t = Double.parseDouble(target);
        } catch (NumberFormatException e) {
            return false;
        }
        List<Integer> all = new ArrayList<>();
        inorder(cloneTree(root), all);
        Set<Integer> allSet = new HashSet<>(all);
        if (all.size() != allSet.size()) return false;
        Set<Integer> outSet = new HashSet<>(output);
        if (outSet.size() != k) return false;
        for (int v : output) {
            if (!allSet.contains(v)) return false;
        }
        double maxOut = -1;
        for (int v : output) maxOut = Math.max(maxOut, Math.abs(v - t));
        double minRest = Double.POSITIVE_INFINITY;
        for (int v : all) {
            if (!outSet.contains(v)) minRest = Math.min(minRest, Math.abs(v - t));
        }
        return maxOut <= minRest + 1e-9;
    }
    private TreeNode cloneTree(TreeNode node) {
        if (node == null) return null;
        TreeNode c = new TreeNode(node.val);
        c.left = cloneTree(node.left);
        c.right = cloneTree(node.right);
        return c;
    }
}
