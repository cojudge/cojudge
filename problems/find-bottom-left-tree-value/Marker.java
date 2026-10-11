import java.util.*;
class Marker {
    public int findBottomLeftValue(TreeNode root) {
        Queue<TreeNode> q = new ArrayDeque<>();
        q.offer(root);
        int ans = root.val;
        while (!q.isEmpty()) {
            int size = q.size();
            ans = q.peek().val;
            for (int i = 0; i < size; i++) {
                TreeNode cur = q.poll();
                if (cur.left != null) q.offer(cur.left);
                if (cur.right != null) q.offer(cur.right);
            }
        }
        return ans;
    }
    public boolean isCorrect(TreeNode root, int output) {
        return output == findBottomLeftValue(root);
    }
}
