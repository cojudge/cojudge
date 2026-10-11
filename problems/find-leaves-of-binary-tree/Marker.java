import java.util.*;
class Marker {
    public List<List<Integer>> findLeaves(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        height(root, ans);
        return ans;
    }
    private int height(TreeNode n, List<List<Integer>> ans) {
        if (n == null) return 0;
        int h = Math.max(height(n.left, ans), height(n.right, ans)) + 1;
        if (ans.size() < h) ans.add(new ArrayList<>());
        ans.get(h - 1).add(n.val);
        return h;
    }
    public boolean isCorrect(TreeNode root, List<List<Integer>> output) {
        List<List<Integer>> exp = findLeaves(root);
        if (output == null || exp.size() != output.size()) return false;
        for (int i = 0; i < exp.size(); i++) {
            List<Integer> a = new ArrayList<>(exp.get(i));
            List<Integer> b = new ArrayList<>(output.get(i));
            if (a.size() != b.size()) return false;
            Collections.sort(a);
            Collections.sort(b);
            if (!a.equals(b)) return false;
        }
        return true;
    }
}
