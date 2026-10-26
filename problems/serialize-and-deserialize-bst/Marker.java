import java.util.*;
class Marker {
    public TreeNode solve(TreeNode root) {
        Codec ser = new Codec();
        Codec deser = new Codec();
        return deser.deserialize(ser.serialize(root));
    }

    public boolean isCorrect(TreeNode root, TreeNode output) {
        return equalTrees(solve(root), output);
    }

    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }

    class Codec {
        public String serialize(TreeNode root) {
            if (root == null) return "[]";
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            Queue<TreeNode> q = new LinkedList<>();
            q.add(root);
            while (!q.isEmpty()) {
                TreeNode node = q.poll();
                if (sb.length() > 1) sb.append(",");
                if (node == null) {
                    sb.append("null");
                } else {
                    sb.append(node.val);
                    q.add(node.left);
                    q.add(node.right);
                }
            }
            sb.append("]");
            return sb.toString();
        }

        public TreeNode deserialize(String data) {
            if (data == null || data.equals("[]")) return null;
            String t = data.trim();
            if (t.startsWith("[")) t = t.substring(1);
            if (t.endsWith("]")) t = t.substring(0, t.length() - 1);
            List<String> tokens = new ArrayList<>();
            StringBuilder cur = new StringBuilder();
            for (int i = 0; i < t.length(); i++) {
                char c = t.charAt(i);
                if (c == ',') {
                    String part = cur.toString().trim();
                    if (part.length() > 0) tokens.add(part);
                    cur.setLength(0);
                } else {
                    cur.append(c);
                }
            }
            String last = cur.toString().trim();
            if (last.length() > 0) tokens.add(last);
            if (tokens.isEmpty()) return null;

            int idx = 0;
            String first = tokens.get(idx++);
            if (first.equals("null") || first.equals("None")) return null;
            TreeNode root = new TreeNode(Integer.parseInt(first));
            Queue<TreeNode> q = new LinkedList<>();
            q.add(root);
            while (!q.isEmpty() && idx < tokens.size()) {
                TreeNode node = q.poll();
                String lv = tokens.get(idx++);
                if (!lv.equals("null") && !lv.equals("None")) {
                    node.left = new TreeNode(Integer.parseInt(lv));
                    q.add(node.left);
                }
                if (idx >= tokens.size()) break;
                String rv = tokens.get(idx++);
                if (!rv.equals("null") && !rv.equals("None")) {
                    node.right = new TreeNode(Integer.parseInt(rv));
                    q.add(node.right);
                }
            }
            return root;
        }
    }
}
