import java.util.*;
class Marker {
    public int[] runCbtInserter(TreeNode root, String[] operations, int[] values) {
        ArrayDeque<TreeNode> cand = new ArrayDeque<>();
        ArrayDeque<TreeNode> bfs = new ArrayDeque<>();
        bfs.add(root);
        while (!bfs.isEmpty()) {
            TreeNode node = bfs.poll();
            if (node.left == null || node.right == null) cand.add(node);
            if (node.left != null) bfs.add(node.left);
            if (node.right != null) bfs.add(node.right);
        }
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            if (operations[i].equals("insert")) {
                TreeNode parent = cand.peek();
                TreeNode node = new TreeNode(values[i]);
                if (parent.left == null) parent.left = node;
                else { parent.right = node; cand.poll(); }
                cand.add(node);
                ans.add(parent.val);
            } else {
                ans.add(root.val);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(TreeNode root, String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runCbtInserter(clone(root), operations, values), output);
    }
    private TreeNode clone(TreeNode node) {
        if (node == null) return null;
        TreeNode c = new TreeNode(node.val);
        c.left = clone(node.left);
        c.right = clone(node.right);
        return c;
    }
}
