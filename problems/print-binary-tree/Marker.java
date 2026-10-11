import java.util.*;
class Marker {
    public List<List<String>> printTree(TreeNode root) {
        int h = height(root);
        int w = (1 << h) - 1;
        List<List<String>> ans = new ArrayList<>();
        for (int i = 0; i < h; i++) {
            List<String> row = new ArrayList<>();
            for (int j = 0; j < w; j++) row.add("");
            ans.add(row);
        }
        fill(root, 0, 0, w - 1, ans);
        return ans;
    }
    private int height(TreeNode n) {
        if (n == null) return 0;
        return 1 + Math.max(height(n.left), height(n.right));
    }
    private void fill(TreeNode n, int r, int l, int rr, List<List<String>> ans) {
        if (n == null) return;
        int c = (l + rr) / 2;
        ans.get(r).set(c, String.valueOf(n.val));
        fill(n.left, r + 1, l, c - 1, ans);
        fill(n.right, r + 1, c + 1, rr, ans);
    }
    public boolean isCorrect(TreeNode root, List<List<String>> output) {
        if (output == null) return false;
        return printTree(cloneTree(root)).equals(output);
    }
    private TreeNode cloneTree(TreeNode n) {
        if (n == null) return null;
        TreeNode c = new TreeNode(n.val);
        c.left = cloneTree(n.left);
        c.right = cloneTree(n.right);
        return c;
    }
}
