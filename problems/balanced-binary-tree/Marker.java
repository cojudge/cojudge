import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

class Marker {
    public boolean isBalanced(TreeNode root) {
        if (root == null) return true;

        List<TreeNode> order = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            order.add(node);
            if (node.left != null) stack.push(node.left);
            if (node.right != null) stack.push(node.right);
        }

        Map<TreeNode, Integer> heights = new IdentityHashMap<>();
        for (int i = order.size() - 1; i >= 0; i--) {
            TreeNode node = order.get(i);
            int leftHeight = node.left == null ? 0 : heights.get(node.left);
            int rightHeight = node.right == null ? 0 : heights.get(node.right);
            if (Math.abs(leftHeight - rightHeight) > 1) return false;
            heights.put(node, 1 + Math.max(leftHeight, rightHeight));
        }
        return true;
    }

    public boolean isCorrect(TreeNode root, boolean output) {
        return output == isBalanced(root);
    }
}
