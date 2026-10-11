import java.util.*;
class Marker {
    public TreeNode treeToDoublyList(TreeNode root) {
        List<Integer> vals = new ArrayList<>();
        inorder(root, vals);
        if (vals.isEmpty()) return null;
        TreeNode head = new TreeNode(vals.get(0));
        TreeNode cur = head;
        for (int i = 1; i < vals.size(); i++) {
            cur.right = new TreeNode(vals.get(i));
            cur = cur.right;
        }
        return head;
    }
    private void inorder(TreeNode n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out);
        out.add(n.val);
        inorder(n.right, out);
    }
    private List<Integer> chainValues(TreeNode head, int limit) {
        List<Integer> res = new ArrayList<>();
        TreeNode cur = head;
        int steps = 0;
        while (cur != null && steps <= limit) {
            if (cur.left != null) return null;
            res.add(cur.val);
            cur = cur.right;
            steps++;
        }
        if (cur != null) return null;
        return res;
    }
    public boolean isCorrect(TreeNode root, TreeNode output) {
        List<Integer> want = new ArrayList<>();
        inorder(root, want);
        if (want.isEmpty()) return output == null;
        if (output == null) return false;
        List<Integer> got = chainValues(output, want.size() + 5);
        if (got == null) return false;
        return want.equals(got);
    }
}
