import java.util.*;
class Marker {
    public boolean leafSimilar(TreeNode root1, TreeNode root2) {
        List<Integer> a = new ArrayList<>(), b = new ArrayList<>();
        collect(root1, a); collect(root2, b);
        return a.equals(b);
    }
    private void collect(TreeNode n, List<Integer> out) {
        if (n == null) return;
        if (n.left == null && n.right == null) { out.add(n.val); return; }
        collect(n.left, out); collect(n.right, out);
    }
    public boolean isCorrect(TreeNode root1, TreeNode root2, boolean output) {
        return leafSimilar(root1, root2) == output;
    }
}
