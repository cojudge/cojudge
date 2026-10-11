import java.util.*;
class Marker {
    public int countNodes(TreeNode root) {
        if (root == null) return 0;
        int leftH = height(root, true);
        int rightH = height(root, false);
        if (leftH == rightH) return (1 << leftH) - 1;
        return 1 + countNodes(root.left) + countNodes(root.right);
    }

    private int height(TreeNode node, boolean goLeft) {
        int h = 0;
        while (node != null) {
            h++;
            node = goLeft ? node.left : node.right;
        }
        return h;
    }

    public boolean isCorrect(TreeNode root, int output) {
        return output == countNodes(root);
    }
}
