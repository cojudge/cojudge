import java.util.*;
class Marker {
    public boolean isCompleteTree(TreeNode root) {
        if (root == null) return true;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        boolean gapSeen = false;
        while (!q.isEmpty()) {
            TreeNode cur = q.poll();
            if (cur == null) {
                gapSeen = true;
            } else {
                if (gapSeen) return false;
                q.offer(cur.left);
                q.offer(cur.right);
            }
        }
        return true;
    }
    public boolean isCorrect(TreeNode root, boolean output) {
        return output == isCompleteTree(root);
    }
}
