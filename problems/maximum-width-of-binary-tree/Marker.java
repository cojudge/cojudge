import java.util.*;
class Marker {
    public int widthOfBinaryTree(TreeNode root) {
        if (root == null) return 0;
        int ans = 1;
        Deque<TreeNode> nq = new ArrayDeque<>();
        Deque<Long> iq = new ArrayDeque<>();
        nq.add(root); iq.add(0L);
        while (!nq.isEmpty()) {
            int sz = nq.size();
            long first = iq.peekFirst(), last = first;
            for (int i = 0; i < sz; i++) {
                TreeNode n = nq.poll();
                long idx = iq.poll() - first;
                last = first + idx;
                if (n.left != null) { nq.add(n.left); iq.add(idx * 2); }
                if (n.right != null) { nq.add(n.right); iq.add(idx * 2 + 1); }
            }
            ans = Math.max(ans, (int)(last - first + 1));
        }
        return ans;
    }
    public boolean isCorrect(TreeNode root, int output) {
        return output == widthOfBinaryTree(root);
    }
}
