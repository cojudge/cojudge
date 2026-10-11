import java.util.*;
class Marker {
    public String serialize(String data) {
        TreeNode root = parseBracket(data);
        if (root == null) return "";
        List<String> vals = new ArrayList<>();
        preorder(root, vals);
        return String.join(",", vals);
    }
    private void preorder(TreeNode n, List<String> out) {
        if (n == null) return;
        out.add(String.valueOf(n.val));
        preorder(n.left, out);
        preorder(n.right, out);
    }
    private TreeNode parseBracket(String data) {
        if (data == null) return null;
        String t = data.trim();
        if (t.equals("[]") || t.equals("")) return null;
        if (t.startsWith("[")) t = t.substring(1);
        if (t.endsWith("]")) t = t.substring(0, t.length() - 1);
        t = t.trim();
        if (t.isEmpty()) return null;
        List<String> tokens = new ArrayList<>();
        StringBuilder cur = new StringBuilder();
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (c == ',') {
                String part = cur.toString().trim();
                if (!part.isEmpty()) tokens.add(part);
                cur.setLength(0);
            } else {
                cur.append(c);
            }
        }
        String last = cur.toString().trim();
        if (!last.isEmpty()) tokens.add(last);
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
    public boolean isCorrect(String data, String output) {
        String exp = serialize(data);
        if (exp == null) return output == null;
        return exp.equals(output);
    }
}
