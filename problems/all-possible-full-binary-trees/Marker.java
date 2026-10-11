import java.util.*;
class Marker {
    private Map<Integer, List<TreeNode>> memo = new HashMap<>();
    public List<String> allPossibleFBT(int n) {
        List<TreeNode> trees = build(n);
        List<String> res = new ArrayList<>();
        for (TreeNode t : trees) res.add(serialize(t));
        return res;
    }
    private List<TreeNode> build(int n) {
        if (memo.containsKey(n)) return memo.get(n);
        List<TreeNode> res = new ArrayList<>();
        if (n % 2 == 1) {
            if (n == 1) {
                res.add(new TreeNode(0));
            } else {
                for (int l = 1; l < n; l += 2) {
                    int r = n - 1 - l;
                    for (TreeNode a : build(l)) {
                        for (TreeNode b : build(r)) {
                            TreeNode root = new TreeNode(0);
                            root.left = cloneTree(a);
                            root.right = cloneTree(b);
                            res.add(root);
                        }
                    }
                }
            }
        }
        memo.put(n, res);
        return res;
    }
    private TreeNode cloneTree(TreeNode node) {
        if (node == null) return null;
        TreeNode c = new TreeNode(0);
        c.left = cloneTree(node.left);
        c.right = cloneTree(node.right);
        return c;
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
        List<String> exp = new ArrayList<>(allPossibleFBT(n));
        List<String> act = new ArrayList<>(output);
        Collections.sort(exp);
        Collections.sort(act);
        return exp.equals(act);
    }
}
