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
    public List<List<Integer>> levelOrder(String data) {
        NNode root = parse(data);
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) return ans;
        Queue<NNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            int sz = q.size();
            List<Integer> level = new ArrayList<>();
            for (int k = 0; k < sz; k++) {
                NNode n = q.poll();
                level.add(n.val);
                for (NNode c : n.children) q.add(c);
            }
            ans.add(level);
        }
        return ans;
    }
    public boolean isCorrect(String data, List<List<Integer>> output) {
        if (output == null) return false;
        return levelOrder(data).equals(output);
    }
}
