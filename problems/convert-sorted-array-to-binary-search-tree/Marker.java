import java.util.*;
class Marker {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    private TreeNode build(int[] a, int l, int r) {
        if (l > r) return null;
        int m = l + (r - l) / 2;
        TreeNode n = new TreeNode(a[m]);
        n.left = build(a, l, m - 1);
        n.right = build(a, m + 1, r);
        return n;
    }
    private void inorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out);
        out.add(n.val);
        inorder(n.right, out);
    }
    private int height(TreeNode n) {
        if (n == null) return 0;
        int l = height(n.left), r = height(n.right);
        if (l < 0 || r < 0 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    }
    private boolean isBST(TreeNode n, long lo, long hi) {
        if (n == null) return true;
        if (n.val <= lo || n.val >= hi) return false;
        return isBST(n.left, lo, n.val) && isBST(n.right, n.val, hi);
    }
    public boolean isCorrect(int[] nums, TreeNode output) {
        if (output == null) return nums.length == 0;
        if (!isBST(output, Long.MIN_VALUE, Long.MAX_VALUE)) return false;
        if (height(output) < 0) return false;
        List<Integer> got = new ArrayList<>();
        inorder(output, got);
        if (got.size() != nums.length) return false;
        for (int i = 0; i < nums.length; i++) if (got.get(i) != nums[i]) return false;
        return true;
    }
}
