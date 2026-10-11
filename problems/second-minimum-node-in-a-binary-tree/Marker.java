import java.util.*;
class Marker {
    public int findSecondMinimumValue(TreeNode root) {
        if (root == null) return -1;
        int first = root.val;
        long second = Long.MAX_VALUE;
        Deque<TreeNode> st = new ArrayDeque<>();
        st.push(root);
        while (!st.isEmpty()) {
            TreeNode n = st.pop();
            if (n == null) continue;
            if (n.val > first && n.val < second) second = n.val;
            if (n.left != null) st.push(n.left);
            if (n.right != null) st.push(n.right);
        }
        return second == Long.MAX_VALUE ? -1 : (int) second;
    }
    public boolean isCorrect(TreeNode root, int output) {
        return findSecondMinimumValue(root) == output;
    }
}
