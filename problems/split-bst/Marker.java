import java.util.*;
class Marker {
    public List<String> splitBST(TreeNode root, int target) {
        TreeNode[] parts = split(root, target);
        List<String> ans = new ArrayList<>();
        ans.add(serialize(parts[0]));
        ans.add(serialize(parts[1]));
        return ans;
    }
    private TreeNode[] split(TreeNode root, int v) {
        if (root == null) return new TreeNode[]{null, null};
        if (root.val <= v) {
            TreeNode[] r = split(root.right, v);
            root.right = r[0];
            return new TreeNode[]{root, r[1]};
        } else {
            TreeNode[] l = split(root.left, v);
            root.left = l[1];
            return new TreeNode[]{l[0], root};
        }
    }
    private String serialize(TreeNode root) {
        if (root == null) return "[]";
        List<String> out = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (node == null) out.add("null");
            else {
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
    private TreeNode clone(TreeNode n) {
        if (n == null) return null;
        TreeNode c = new TreeNode(n.val);
        c.left = clone(n.left);
        c.right = clone(n.right);
        return c;
    }
    public boolean isCorrect(TreeNode root, int target, List<String> output) {
        if (output == null || output.size() != 2) return false;
        List<String> exp = splitBST(clone(root), target);
        return exp.equals(output);
    }
}
