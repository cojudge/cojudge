import java.util.*;
class Marker {
    public int[] postorderTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        post(root, out);
        int[] res = new int[out.size()];
        for (int i = 0; i < out.size(); i++) res[i] = out.get(i);
        return res;
    }
    private void post(TreeNode node, List<Integer> out) {
        if (node == null) return;
        post(node.left, out);
        post(node.right, out);
        out.add(node.val);
    }
    public boolean isCorrect(TreeNode root, int[] output) {
        return output != null && Arrays.equals(postorderTraversal(root), output);
    }
}
