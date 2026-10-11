import java.util.*;
class Marker {
    public boolean isUnivalTree(TreeNode root) {
        if (root == null) return true;
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode cur = stack.pop();
            if (cur.val != root.val) return false;
            if (cur.left != null) stack.push(cur.left);
            if (cur.right != null) stack.push(cur.right);
        }
        return true;
    }
    public boolean isCorrect(TreeNode root, boolean output) {
        return output == isUnivalTree(root);
    }
}
