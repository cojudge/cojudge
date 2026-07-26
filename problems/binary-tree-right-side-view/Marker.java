import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;

class Marker {
    public int[] rightSideView(TreeNode root) {
        if (root == null) return new int[0];

        List<Integer> visible = new ArrayList<>();
        Queue<TreeNode> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.remove();
                if (i == levelSize - 1) visible.add(node.val);
                if (node.left != null) queue.add(node.left);
                if (node.right != null) queue.add(node.right);
            }
        }

        int[] result = new int[visible.size()];
        for (int i = 0; i < visible.size(); i++) result[i] = visible.get(i);
        return result;
    }

    public boolean isCorrect(TreeNode root, int[] output) {
        return output != null && Arrays.equals(rightSideView(root), output);
    }
}
