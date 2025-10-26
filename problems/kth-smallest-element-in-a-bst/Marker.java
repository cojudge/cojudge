import java.util.*;
class Marker {
    public int kthSmallest(TreeNode root, int k) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode curr = root;
        int count = 0;
        while (curr != null || !stack.isEmpty()) {
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            curr = stack.pop();
            count++;
            if (count == k) return curr.val;
            curr = curr.right;
        }
        return -1; // unreachable if k is valid
    }

    public boolean isCorrect(TreeNode root, int k, int output) {
        return output == kthSmallest(root, k);
    }
}
