import java.util.*;
class Marker {
    public List<Integer> boundaryOfBinaryTree(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        if (root.left == null && root.right == null) {
            res.add(root.val);
            return res;
        }
        res.add(root.val);
        TreeNode cur = root.left;
        while (cur != null) {
            if (cur.left != null || cur.right != null) res.add(cur.val);
            if (cur.left != null) cur = cur.left;
            else cur = cur.right;
        }
        collectLeaves(root, res);
        List<Integer> tmp = new ArrayList<>();
        cur = root.right;
        while (cur != null) {
            if (cur.left != null || cur.right != null) tmp.add(cur.val);
            if (cur.right != null) cur = cur.right;
            else cur = cur.left;
        }
        for (int i = tmp.size() - 1; i >= 0; i--) res.add(tmp.get(i));
        return res;
    }
    private void collectLeaves(TreeNode node, List<Integer> res) {
        if (node == null) return;
        if (node.left == null && node.right == null) {
            res.add(node.val);
            return;
        }
        collectLeaves(node.left, res);
        collectLeaves(node.right, res);
    }
    public boolean isCorrect(TreeNode root, List<Integer> output) {
        List<Integer> exp = boundaryOfBinaryTree(root);
        return exp.equals(output);
    }
}
