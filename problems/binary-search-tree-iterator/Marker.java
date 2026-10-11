import java.util.*;
class Marker {
    public int[] runBstIterator(TreeNode root, String[] operations) {
        List<Integer> order = new ArrayList<>();
        inorder(root, order);
        List<Integer> ans = new ArrayList<>();
        int idx = 0;
        for (String op : operations) {
            if (op.equals("next")) {
                ans.add(order.get(idx));
                idx++;
            } else if (op.equals("hasNext")) {
                ans.add(idx < order.size() ? 1 : 0);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    private void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);
        inorder(node.right, out);
    }
    public boolean isCorrect(TreeNode root, String[] operations, int[] output) {
        return output != null && Arrays.equals(runBstIterator(cloneTree(root), operations), output);
    }
    private TreeNode cloneTree(TreeNode node) {
        if (node == null) return null;
        TreeNode c = new TreeNode(node.val);
        c.left = cloneTree(node.left);
        c.right = cloneTree(node.right);
        return c;
    }
}
