import java.util.*;
class Marker {
    public TreeNode buildTree(int[] inorder, int[] postorder) {
        if (inorder == null || postorder == null || inorder.length != postorder.length) return null;
        if (inorder.length == 0) return null;
        Map<Integer, Integer> idx = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);
        int[] post = new int[]{postorder.length - 1};
        return helper(inorder, 0, inorder.length - 1, postorder, post, idx);
    }
    private TreeNode helper(int[] in, int l, int r, int[] post, int[] pi, Map<Integer, Integer> idx) {
        if (l > r) return null;
        int rootVal = post[pi[0]--];
        TreeNode root = new TreeNode(rootVal);
        int mid = idx.get(rootVal);
        root.right = helper(in, mid + 1, r, post, pi, idx);
        root.left = helper(in, l, mid - 1, post, pi, idx);
        return root;
    }
    private boolean isSame(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (a.val != b.val) return false;
        return isSame(a.left, b.left) && isSame(a.right, b.right);
    }
    public boolean isCorrect(int[] inorder, int[] postorder, TreeNode output) {
        return isSame(buildTree(inorder, postorder), output);
    }
}
