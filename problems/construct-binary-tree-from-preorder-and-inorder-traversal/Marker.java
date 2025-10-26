import java.util.*;
class Marker {
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        if (preorder == null || inorder == null || preorder.length != inorder.length) return null;
        Map<Integer, Integer> idx = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) idx.put(inorder[i], i);
        return helper(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1, idx);
    }

    private TreeNode helper(int[] pre, int ps, int pe, int[] in, int is, int ie, Map<Integer, Integer> idx) {
        if (ps > pe || is > ie) return null;
        int rootVal = pre[ps];
        TreeNode root = new TreeNode(rootVal);
        int mid = idx.get(rootVal);
        int leftSize = mid - is;
        root.left = helper(pre, ps + 1, ps + leftSize, in, is, mid - 1, idx);
        root.right = helper(pre, ps + leftSize + 1, pe, in, mid + 1, ie, idx);
        return root;
    }

    private boolean isSame(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (a.val != b.val) return false;
        return isSame(a.left, b.left) && isSame(a.right, b.right);
    }

    public boolean isCorrect(int[] preorder, int[] inorder, TreeNode output) {
        TreeNode expected = buildTree(preorder, inorder);
        return isSame(expected, output);
    }
}
