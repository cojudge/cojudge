import java.util.*;
class Marker {
    private Map<Integer, Integer> freq = new HashMap<>();
    public int[] findFrequentTreeSum(TreeNode root) {
        freq = new HashMap<>();
        if (root == null) return new int[]{};
        dfs(root);
        int best = 0;
        for (int c : freq.values()) best = Math.max(best, c);
        List<Integer> res = new ArrayList<>();
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            if (e.getValue() == best) res.add(e.getKey());
        }
        int[] ans = new int[res.size()];
        for (int i = 0; i < res.size(); i++) ans[i] = res.get(i);
        return ans;
    }
    private int dfs(TreeNode node) {
        if (node == null) return 0;
        int s = node.val + dfs(node.left) + dfs(node.right);
        freq.put(s, freq.getOrDefault(s, 0) + 1);
        return s;
    }
    public boolean isCorrect(TreeNode root, int[] output) {
        int[] expected = findFrequentTreeSum(root);
        if (output == null) return expected.length == 0;
        int[] a = expected.clone();
        int[] b = output.clone();
        Arrays.sort(a);
        Arrays.sort(b);
        return Arrays.equals(a, b);
    }
}
