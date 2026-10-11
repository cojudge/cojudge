import java.util.*;
class Marker {
    public List<String> generateTrees(int n) {
        if (n == 0) return new ArrayList<>();
        List<TreeNode> trees = build(1, n);
        List<String> res = new ArrayList<>();
        for (TreeNode t : trees) res.add(serialize(t));
        return res;
    }
    private List<TreeNode> build(int start, int end) {
        List<TreeNode> res = new ArrayList<>();
        if (start > end) {
            res.add(null);
            return res;
        }
        for (int r = start; r <= end; r++) {
            List<TreeNode> lefts = build(start, r - 1);
            List<TreeNode> rights = build(r + 1, end);
            for (TreeNode l : lefts) {
                for (TreeNode rt : rights) {
                    TreeNode root = new TreeNode(r);
                    root.left = l;
                    root.right = rt;
                    res.add(root);
                }
            }
        }
        return res;
    }
    private String serialize(TreeNode root) {
        if (root == null) return "[]";
        List<String> out = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (node == null) {
                out.add("null");
            } else {
                out.add(String.valueOf(node.val));
                q.add(node.left);
                q.add(node.right);
            }
        }
        int i = out.size() - 1;
        while (i >= 0 && out.get(i).equals("null")) i--;
        StringBuilder sb = new StringBuilder("[");
        for (int j = 0; j <= i; j++) {
            if (j > 0) sb.append(",");
            sb.append(out.get(j));
        }
        sb.append("]");
        return sb.toString();
    }
    public boolean isCorrect(int n, List<String> output) {
        if (output == null) return false;
        List<String> exp = new ArrayList<>(generateTrees(n));
        List<String> act = new ArrayList<>(output);
        Collections.sort(exp);
        Collections.sort(act);
        return exp.equals(act);
    }
}
