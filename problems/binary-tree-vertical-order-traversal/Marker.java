import java.util.*;
class Marker {
    public List<List<Integer>> verticalOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Map<Integer, List<Integer>> cols = new TreeMap<>();
        Queue<TreeNode> nodes = new ArrayDeque<>();
        Queue<Integer> idx = new ArrayDeque<>();
        nodes.add(root);
        idx.add(0);
        while (!nodes.isEmpty()) {
            TreeNode cur = nodes.poll();
            int c = idx.poll();
            cols.computeIfAbsent(c, k -> new ArrayList<>()).add(cur.val);
            if (cur.left != null) { nodes.add(cur.left); idx.add(c - 1); }
            if (cur.right != null) { nodes.add(cur.right); idx.add(c + 1); }
        }
        res.addAll(cols.values());
        return res;
    }
    public boolean isCorrect(TreeNode root, List<List<Integer>> output) {
        List<List<Integer>> expected = verticalOrder(root);
        if (expected.size() != output.size()) return false;
        for (int i = 0; i < expected.size(); i++) {
            if (!expected.get(i).equals(output.get(i))) return false;
        }
        return true;
    }
}
