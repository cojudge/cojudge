import java.util.*;
class Marker {
    public int inorderSuccessor(TreeNode root, String parents, int p) {
        if (root == null) return -1;
        List<TreeNode> bfs = new ArrayList<>();
        Map<Integer, TreeNode> byVal = new HashMap<>();
        Map<Integer, Integer> structural = new HashMap<>();
        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        structural.put(root.val, null);
        while (!q.isEmpty()) {
            TreeNode cur = q.poll();
            bfs.add(cur);
            byVal.put(cur.val, cur);
            if (cur.left != null) {
                structural.put(cur.left.val, cur.val);
                q.offer(cur.left);
            }
            if (cur.right != null) {
                structural.put(cur.right.val, cur.val);
                q.offer(cur.right);
            }
        }
        if (!byVal.containsKey(p)) return -1;
        Map<Integer, Integer> parentOf = new HashMap<>(structural);
        List<Integer> parsed = parseParents(parents);
        if (parsed.size() == bfs.size()) {
            boolean ok = true;
            for (int i = 0; i < bfs.size(); i++) {
                if (parsed.get(i) != null && !byVal.containsKey(parsed.get(i)) && !(parsed.get(i) == null)) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                parentOf = new HashMap<>();
                for (int i = 0; i < bfs.size(); i++) {
                    parentOf.put(bfs.get(i).val, parsed.get(i));
                }
            }
        }
        TreeNode target = byVal.get(p);
        if (target.right != null) {
            TreeNode cur = target.right;
            while (cur.left != null) cur = cur.left;
            return cur.val;
        }
        TreeNode cur = target;
        while (true) {
            Integer pv = parentOf.get(cur.val);
            if (pv == null) return -1;
            TreeNode parent = byVal.get(pv);
            if (parent == null) return -1;
            if (parent.left == cur) return parent.val;
            cur = parent;
        }
    }

    private List<Integer> parseParents(String s) {
        List<Integer> res = new ArrayList<>();
        if (s == null) return res;
        s = s.trim();
        if (s.length() < 2) return res;
        String inner = s.substring(1, s.length() - 1).trim();
        if (inner.isEmpty()) return res;
        for (String tok : inner.split(",")) {
            tok = tok.trim();
            if (tok.equals("null")) res.add(null);
            else res.add(Integer.parseInt(tok));
        }
        return res;
    }

    public boolean isCorrect(TreeNode root, String parents, int p, int output) {
        return output == inorderSuccessor(root, parents, p);
    }
}
