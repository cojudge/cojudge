import java.util.*;
class Marker {
    private int ans;
    public int minCameraCover(TreeNode root) {
        ans = 0;
        if (dfs(root) == 0) ans++;
        return ans;
    }
    private int dfs(TreeNode node) {
        if (node == null) return 1;
        int l = dfs(node.left);
        int r = dfs(node.right);
        if (l == 0 || r == 0) {
            ans++;
            return 2;
        }
        if (l == 2 || r == 2) return 1;
        return 0;
    }
    public boolean isCorrect(TreeNode root, int output) {
        return output == minCameraCover(root);
    }
}
