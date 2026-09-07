import java.util.*;
class Marker {
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (key < root.val) root.left = deleteNode(root.left, key);
        else if (key > root.val) root.right = deleteNode(root.right, key);
        else {
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            TreeNode succ = root.right;
            while (succ.left != null) succ = succ.left;
            root.val = succ.val;
            root.right = deleteNode(root.right, succ.val);
        }
        return root;
    }
    public boolean isCorrect(TreeNode root, int key, TreeNode output) {
        // Validate: output is a BST containing all original values except key
        Set<Integer> orig = new HashSet<>();
        collect(root, orig);
        orig.remove(key);
        Set<Integer> got = new HashSet<>();
        if (!isBST(output, Long.MIN_VALUE, Long.MAX_VALUE, got)) return false;
        return orig.equals(got);
    }
    private void collect(TreeNode n, Set<Integer> s) {
        if (n == null) return;
        s.add(n.val);
        collect(n.left, s);
        collect(n.right, s);
    }
    private boolean isBST(TreeNode n, long lo, long hi, Set<Integer> s) {
        if (n == null) return true;
        if (n.val <= lo || n.val >= hi) return false;
        if (!s.add(n.val)) return false;
        return isBST(n.left, lo, n.val, s) && isBST(n.right, n.val, hi, s);
    }
}
