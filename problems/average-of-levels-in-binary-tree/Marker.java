import java.util.*;
class Marker {
    public List<String> averageOfLevels(TreeNode root) {
        List<String> ans = new ArrayList<>();
        if (root == null) return ans;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int sz = q.size();
            double sum = 0;
            for (int i = 0; i < sz; i++) {
                TreeNode cur = q.poll();
                sum += cur.val;
                if (cur.left != null) q.offer(cur.left);
                if (cur.right != null) q.offer(cur.right);
            }
            ans.add(Double.toString(sum / sz));
        }
        return ans;
    }
    public boolean isCorrect(TreeNode root, List<String> output) {
        List<String> exp = averageOfLevels(root);
        if (output == null || output.size() != exp.size()) return false;
        for (int i = 0; i < exp.size(); i++) {
            try {
                double a = Double.parseDouble(exp.get(i));
                double b = Double.parseDouble(output.get(i));
                if (!Double.isFinite(a) || !Double.isFinite(b)) return false;
                double tol = 1e-9 + 1e-5 * Math.abs(a);
                if (Math.abs(a - b) > tol) return false;
            } catch (NumberFormatException e) { return false; }
        }
        return true;
    }
}
