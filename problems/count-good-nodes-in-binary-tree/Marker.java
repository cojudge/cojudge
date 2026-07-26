import java.util.ArrayDeque;
import java.util.Deque;

class Marker {
    public int goodNodes(TreeNode root) {
        if (root == null) return 0;

        Deque<TreeNode> nodes = new ArrayDeque<>();
        Deque<Integer> pathMaximums = new ArrayDeque<>();
        nodes.push(root);
        pathMaximums.push(root.val);
        int count = 0;

        while (!nodes.isEmpty()) {
            TreeNode node = nodes.pop();
            int pathMaximum = pathMaximums.pop();
            if (node.val >= pathMaximum) count++;
            int nextMaximum = Math.max(pathMaximum, node.val);

            if (node.left != null) {
                nodes.push(node.left);
                pathMaximums.push(nextMaximum);
            }
            if (node.right != null) {
                nodes.push(node.right);
                pathMaximums.push(nextMaximum);
            }
        }
        return count;
    }

    public boolean isCorrect(TreeNode root, int output) {
        return output == goodNodes(root);
    }
}
