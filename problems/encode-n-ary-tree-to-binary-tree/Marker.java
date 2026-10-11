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
    private NNode parse(String data) {
        List<String> toks = tokens(data);
        if (toks.isEmpty()) return null;
        if (toks.get(0).equals("null")) return null;
        NNode root = new NNode(Integer.parseInt(toks.get(0)));
        Queue<NNode> q = new LinkedList<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < toks.size()) {
            NNode node = q.poll();
            if (i < toks.size() && toks.get(i).equals("null")) i++;
            List<NNode> kids = new ArrayList<>();
            while (i < toks.size() && !toks.get(i).equals("null")) {
                NNode c = new NNode(Integer.parseInt(toks.get(i)));
                kids.add(c);
                q.add(c);
                i++;
            }
            node.children = kids;
        }
        return root;
    }
    private TreeNode encode(NNode n) {
        if (n == null) return null;
        TreeNode b = new TreeNode(n.val);
        if (!n.children.isEmpty()) {
            b.left = encode(n.children.get(0));
            TreeNode cur = b.left;
            for (int i = 1; i < n.children.size(); i++) {
                cur.right = encode(n.children.get(i));
                cur = cur.right;
            }
        }
        return b;
    }
    private NNode decode(TreeNode b) {
        if (b == null) return null;
        NNode n = new NNode(b.val);
        TreeNode c = b.left;
        while (c != null) {
            n.children.add(decode(c));
            c = c.right;
        }
        return n;
    }
    private String serialize(NNode root) {
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
    public String encodeDecode(String data) {
        NNode root = parse(data);
        TreeNode b = encode(root);
        NNode back = decode(b);
        return serialize(back);
    }
    public boolean isCorrect(String data, String output) {
        if (output == null) return false;
        return encodeDecode(data).equals(output.trim());
    }
}
