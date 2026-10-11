import java.util.*;
class Marker {
    private TreeNode found = null;
    public List<Integer> distanceK(TreeNode root, int target, int k) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        found = null;
        build(root, null, parent, target);
        List<Integer> ans = new ArrayList<>();
        if (found == null) return ans;
        Queue<TreeNode> q = new LinkedList<>();
        Set<TreeNode> vis = new HashSet<>();
        q.offer(found); vis.add(found);
        int d = 0;
        while (!q.isEmpty()) {
            int sz = q.size();
            if (d == k) {
                for (TreeNode n : q) ans.add(n.val);
                break;
            }
            for (int i = 0; i < sz; i++) {
                TreeNode cur = q.poll();
                if (cur.left != null && vis.add(cur.left)) q.offer(cur.left);
                if (cur.right != null && vis.add(cur.right)) q.offer(cur.right);
                TreeNode p = parent.get(cur);
                if (p != null && vis.add(p)) q.offer(p);
            }
            d++;
        }
        Collections.sort(ans);
        return ans;
    }
    private void build(TreeNode n, TreeNode p, Map<TreeNode, TreeNode> parent, int target) {
        if (n == null) return;
        parent.put(n, p);
        if (n.val == target) found = n;
        build(n.left, n, parent, target);
        build(n.right, n, parent, target);
    }
    public boolean isCorrect(TreeNode root, int target, int k, List<Integer> output) {
        List<Integer> exp = distanceK(root, target, k);
        if (output == null) return false;
        List<Integer> a = new ArrayList<>(output);
        List<Integer> b = new ArrayList<>(exp);
        Collections.sort(a); Collections.sort(b);
        return a.equals(b);
    }
}
