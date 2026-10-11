import java.util.*;
class Marker {
    public boolean findTarget(TreeNode root, int k) {
        Set<Integer> seen = new HashSet<>();
        Deque<TreeNode> st = new ArrayDeque<>();
        if (root != null) st.push(root);
        while (!st.isEmpty()) {
            TreeNode n = st.pop();
            if (seen.contains(k - n.val)) return true;
            seen.add(n.val);
            if (n.left != null) st.push(n.left);
            if (n.right != null) st.push(n.right);
        }
        return false;
    }
    public boolean isCorrect(TreeNode root, int k, boolean output) {
        return output == findTarget(root, k);
    }
}
