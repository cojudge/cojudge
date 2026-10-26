import java.util.*;
class Marker {
    static class NNode {
        int val;
        List<NNode> children = new ArrayList<>();
        NNode(int v) { val = v; }
    }
    private List<String> tokens(String data) {
        String t = data == null ? "" : data.trim();
        if (t.equals("") || t.equals("[]")) return new ArrayList<>();
        if (t.startsWith("[")) t = t.substring(1);
        if (t.endsWith("]")) t = t.substring(0, t.length() - 1);
        List<String> res = new ArrayList<>();
        StringBuilder cur = new StringBuilder();
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (c == ',') {
                String p = cur.toString().trim();
                if (p.length() > 0) res.add(p);
                cur.setLength(0);
            } else cur.append(c);
        }
        String last = cur.toString().trim();
        if (last.length() > 0) res.add(last);
        return res;
    }
    private NNode parseNary(String data) {
        List<String> toks = tokens(data);
        if (toks.isEmpty()) return null;
        if (toks.get(0).equals("null") || toks.get(0).equals("None")) return null;
        NNode root = new NNode(safeInt(toks.get(0)));
        Queue<NNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < toks.size()) {
            NNode node = q.poll();
            if (i < toks.size() && toks.get(i).equals("null")) i++;
            List<NNode> kids = new ArrayList<>();
            while (i < toks.size() && !toks.get(i).equals("null")) {
                NNode c = new NNode(safeInt(toks.get(i)));
                kids.add(c);
                q.add(c);
                i++;
            }
            node.children = kids;
        }
        return root;
    }
    private int safeInt(String s) {
        try { return Integer.parseInt(s.trim()); } catch (NumberFormatException e) { return 0; }
    }
    private String serializeNary(NNode root) {
        if (root == null) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[").append(root.val);
        List<List<NNode>> order = new ArrayList<>();
        Queue<NNode> bfs = new LinkedList<>();
        bfs.add(root);
        while (!bfs.isEmpty()) {
            NNode n = bfs.poll();
            order.add(n.children);
            for (NNode c : n.children) bfs.add(c);
        }
        int last = order.size() - 1;
        while (last >= 0 && order.get(last).isEmpty()) last--;
        for (int g = 0; g <= last; g++) {
            sb.append(",null");
            for (NNode c : order.get(g)) sb.append(",").append(c.val);
        }
        sb.append("]");
        return sb.toString();
    }
    private TreeNode encodeBinary(NNode n) {
        if (n == null) return null;
        TreeNode b = new TreeNode(n.val);
        if (!n.children.isEmpty()) {
            b.left = encodeBinary(n.children.get(0));
            TreeNode cur = b.left;
            for (int i = 1; i < n.children.size(); i++) {
                cur.right = encodeBinary(n.children.get(i));
                cur = cur.right;
            }
        }
        return b;
    }
    private NNode decodeBinary(TreeNode b) {
        if (b == null) return null;
        NNode n = new NNode(b.val);
        TreeNode c = b.left;
        while (c != null) {
            n.children.add(decodeBinary(c));
            c = c.right;
        }
        return n;
    }
    private TreeNode parseBinary(String data) {
        List<String> toks = tokens(data);
        if (toks.isEmpty()) return null;
        String first = toks.get(0);
        if (first.equals("null") || first.equals("None")) return null;
        TreeNode root = new TreeNode(safeInt(first));
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int idx = 1;
        while (!q.isEmpty() && idx < toks.size()) {
            TreeNode node = q.poll();
            String lv = toks.get(idx++);
            if (!lv.equals("null") && !lv.equals("None")) {
                node.left = new TreeNode(safeInt(lv));
                q.add(node.left);
            }
            if (idx >= toks.size()) break;
            String rv = toks.get(idx++);
            if (!rv.equals("null") && !rv.equals("None")) {
                node.right = new TreeNode(safeInt(rv));
                q.add(node.right);
            }
        }
        return root;
    }
    private String serializeBinary(TreeNode root) {
        if (root == null) return "[]";
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        boolean first = true;
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (!first) sb.append(",");
            first = false;
            if (node == null) {
                sb.append("null");
            } else {
                sb.append(node.val);
                q.add(node.left);
                q.add(node.right);
            }
        }
        String s = sb.toString();
        while (s.endsWith(",null")) s = s.substring(0, s.length() - 5);
        return s + "]";
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
    public List<String> solve(String data) {
        NNode root = parseNary(data);
        String binA = serializeBinary(encodeBinary(root));
        String binB = serializeBinary(encodeBinary(root));
        String nary = serializeNary(decodeBinary(parseBinary(binA)));
        return Arrays.asList(binA, binB, nary);
    }
    public boolean isCorrect(String data, List<String> output) {
        if (output == null || output.size() != 3) return false;
        String binA = output.get(0);
        String binB = output.get(1);
        String nary = output.get(2);
        if (binA == null || binB == null || nary == null) return false;
        if (!binA.trim().equals(binB.trim())) return false;
        NNode root = parseNary(data);
        if (!nary.trim().equals(serializeNary(root))) return false;
        TreeNode got = parseBinary(binA.trim());
        if (!equalTrees(got, encodeBinary(root))) return false;
        return true;
    }
}
