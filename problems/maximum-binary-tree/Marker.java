import java.util.*;
class Marker {
    public TreeNode constructMaximumBinaryTree(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }
    private TreeNode build(int[] nums, int l, int r) {
        if (l > r) return null;
        int m = l;
        for (int i = l + 1; i <= r; i++) if (nums[i] > nums[m]) m = i;
        TreeNode n = new TreeNode(nums[m]);
        n.left = build(nums, l, m - 1);
        n.right = build(nums, m + 1, r);
        return n;
    }
    public boolean isCorrect(int[] nums, TreeNode output) {
        return equalTrees(constructMaximumBinaryTree(nums), output);
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
}
