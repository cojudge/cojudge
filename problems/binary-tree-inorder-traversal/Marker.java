import java.util.*;
class Marker {
    public int[] inorderTraversal(TreeNode root) {
        List<Integer> out = new ArrayList<>();
        inorder(root, out);
        int[] res = new int[out.size()];
        for (int i = 0; i < out.size(); i++) res[i] = out.get(i);
        return res;
    }

    private void inorder(TreeNode node, List<Integer> out) {
        if (node == null) return;
        inorder(node.left, out);
        out.add(node.val);
        inorder(node.right, out);
    }

    public boolean isCorrect(TreeNode root, int[] output) {
        return output != null && Arrays.equals(inorderTraversal(root), output);
    }
}
