import java.util.*;
class Marker {
    public int[] preorderTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        preorder(root, out);
        int[] res = new int[out.size()];
        for (int i = 0; i < out.size(); i++) res[i] = out.get(i);
        return res;
    }

    private void preorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        out.add(node.val);
        preorder(node.left, out);
        preorder(node.right, out);
    }

    public boolean isCorrect(TreeNode root, int[] output) {
        return output != null && Arrays.equals(preorderTraversal(root), output);
    }
}
