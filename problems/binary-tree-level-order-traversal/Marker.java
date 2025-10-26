import java.util.*;
class Marker {
    public List<List<Integer>> levelOrder(TreeNode root) {
        if (root == null) return new ArrayList<>();
        List<List<Integer>> levels = new ArrayList<>();
        Queue<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        while (!q.isEmpty()) {
            int size = q.size();
            List<Integer> level = new ArrayList<>(size);
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                level.add(node.val);
                if (node.left != null) q.add(node.left);
                if (node.right != null) q.add(node.right);
            }
            levels.add(level);
        }
        return levels;
    }

    public boolean isCorrect(TreeNode root, List<List<Integer>> output) {
        var expected = levelOrder(root);
        if (expected.size() != output.size()) return false;
        for (int i = 0; i < expected.size(); i++) {
            if (expected.get(i).size() != output.get(i).size()) return false;
            for (int j = 0; j < expected.get(i).size(); j++) {
                if (expected.get(i).get(j) != output.get(i).get(j)) return false;
            }
        }
        return true;
    }
}
