import java.util.*;
class Marker {
    public int pathSum(TreeNode root, int targetSum) {
        Map<Long, Integer> freq = new HashMap<>();
        freq.put(0L, 1);
        return dfs(root, 0L, targetSum, freq);
    }
    private int dfs(TreeNode n, long cur, int target, Map<Long, Integer> freq) {
        if (n == null) return 0;
        cur += n.val;
        int res = freq.getOrDefault(cur - target, 0);
        freq.put(cur, freq.getOrDefault(cur, 0) + 1);
        res += dfs(n.left, cur, target, freq);
        res += dfs(n.right, cur, target, freq);
        freq.put(cur, freq.get(cur) - 1);
        return res;
    }
    public boolean isCorrect(TreeNode root, int targetSum, int output) {
        return output == pathSum(root, targetSum);
    }
}
