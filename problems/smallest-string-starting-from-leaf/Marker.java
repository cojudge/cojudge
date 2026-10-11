import java.util.*;
class Marker {
    private String best;
    public String smallestFromLeaf(TreeNode root) {
        best = null;
        StringBuilder path = new StringBuilder();
        dfs(root, path);
        return best == null ? "" : best;
    }
    private void dfs(TreeNode node, StringBuilder path) {
        if (node == null) return;
        path.append((char) ('a' + node.val));
        if (node.left == null && node.right == null) {
            StringBuilder rev = new StringBuilder(path).reverse();
            String cand = rev.toString();
            if (best == null || cand.compareTo(best) < 0) best = cand;
        } else {
            dfs(node.left, path);
            dfs(node.right, path);
        }
        path.deleteCharAt(path.length() - 1);
    }
    public boolean isCorrect(TreeNode root, String output) {
        return smallestFromLeaf(root).equals(output);
    }
}
