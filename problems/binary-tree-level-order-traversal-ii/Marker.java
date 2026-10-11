import java.util.*;
class Marker {
    public List<List<Integer>> levelOrderBottom(TreeNode root) {
        List<List<Integer>> ans = new ArrayList<>();
        if (root == null) return ans;
        Queue<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>(size);
            for (int i = 0; i < size; i++) {
                TreeNode n = q.poll();
                level.add(n.val);
                if (n.left != null) q.add(n.left);
                if (n.right != null) q.add(n.right);
            }
            ans.add(level);
        }
        Collections.reverse(ans);
        return ans;
    }
    public boolean isCorrect(TreeNode root, List<List<Integer>> output) {
        List<List<Integer>> exp = levelOrderBottom(root);
        if (exp.size() != output.size()) return false;
        for (int i = 0; i < exp.size(); i++) {
            if (!exp.get(i).equals(output.get(i))) return false;
        }
        return true;
    }
}
