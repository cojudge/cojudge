import java.util.*;
class Marker {
    private static final class Triple {
        final int col;
        final int row;
        final int val;
        Triple(int c, int r, int v) { col = c; row = r; val = v; }
    }
    public List<List<Integer>> verticalTraversal(TreeNode root) {
        List<Triple> nodes = new ArrayList<>();
        collect(root, 0, 0, nodes);
        nodes.sort((a, b) -> {
            if (a.col != b.col) return Integer.compare(a.col, b.col);
            if (a.row != b.row) return Integer.compare(a.row, b.row);
            return Integer.compare(a.val, b.val);
        });
        List<List<Integer>> ans = new ArrayList<>();
        int prevCol = Integer.MIN_VALUE;
        List<Integer> cur = null;
        for (Triple t : nodes) {
            if (t.col != prevCol) {
                cur = new ArrayList<>();
                ans.add(cur);
                prevCol = t.col;
            }
            cur.add(t.val);
        }
        return ans;
    }
    private void collect(TreeNode node, int col, int row, List<Triple> out) {
        if (node == null) return;
        out.add(new Triple(col, row, node.val));
        collect(node.left, col - 1, row + 1, out);
        collect(node.right, col + 1, row + 1, out);
    }
    public boolean isCorrect(TreeNode root, List<List<Integer>> output) {
        List<List<Integer>> exp = verticalTraversal(root);
        if (output == null || exp.size() != output.size()) return false;
        for (int i = 0; i < exp.size(); i++) {
            List<Integer> a = exp.get(i);
            List<Integer> b = output.get(i);
            if (a.size() != b.size()) return false;
            for (int j = 0; j < a.size(); j++) {
                if (!a.get(j).equals(b.get(j))) return false;
            }
        }
        return true;
    }
}
