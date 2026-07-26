import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

class Marker {
    public int diameterOfBinaryTree(TreeNode root) {
        if (root == null) return 0;

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
        int diameter = 0;
        for (int i = order.size() - 1; i >= 0; i--) {
            TreeNode node = order.get(i);
            int leftHeight = node.left == null ? 0 : heights.get(node.left);
            int rightHeight = node.right == null ? 0 : heights.get(node.right);
            diameter = Math.max(diameter, leftHeight + rightHeight);
            heights.put(node, 1 + Math.max(leftHeight, rightHeight));
        }
        return diameter;
    }

    public boolean isCorrect(TreeNode root, int output) {
        return output == diameterOfBinaryTree(root);
    }
}
