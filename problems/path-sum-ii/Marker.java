import java.util.*;
class Marker {
    public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
        List<List<Integer>> ans = new ArrayList<>();
        dfs(root, targetSum, new ArrayList<>(), ans);
        return ans;
    }
    private void dfs(TreeNode n, int rest, List<Integer> path, List<List<Integer>> ans) {
        if (n == null) return;
        path.add(n.val);
        if (n.left == null && n.right == null) {
            if (n.val == rest) ans.add(new ArrayList<>(path));
        } else {
            dfs(n.left, rest - n.val, path, ans);
            dfs(n.right, rest - n.val, path, ans);
        }
        path.remove(path.size() - 1);
    }
    private List<List<Integer>> canonicalize(List<List<Integer>> rows) {
        List<List<Integer>> res = new ArrayList<>();
        for (List<Integer> r : rows) res.add(new ArrayList<>(r));
        res.sort((a, b) -> {
            int m = Math.min(a.size(), b.size());
            for (int i = 0; i < m; i++) {
                int c = Integer.compare(a.get(i), b.get(i));
                if (c != 0) return c;
            }
            return Integer.compare(a.size(), b.size());
        });
        return res;
    }
    public boolean isCorrect(TreeNode root, int targetSum, List<List<Integer>> output) {
        return canonicalize(pathSum(root, targetSum)).equals(canonicalize(output));
    }
}
