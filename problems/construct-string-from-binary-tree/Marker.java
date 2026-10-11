import java.util.*;
class Marker {
    public String tree2str(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        build(root, sb);
        return sb.toString();
    }
    private void build(TreeNode t, StringBuilder sb) {
        if (t == null) return;
        sb.append(t.val);
        if (t.left != null || t.right != null) {
            sb.append("(");
            build(t.left, sb);
            sb.append(")");
        }
        if (t.right != null) {
            sb.append("(");
            build(t.right, sb);
            sb.append(")");
        }
    }
    public boolean isCorrect(TreeNode root, String output) {
        String expected = tree2str(clone(root));
        return expected.equals(output);
    }
    private TreeNode clone(TreeNode t) {
        if (t == null) return null;
        TreeNode n = new TreeNode(t.val);
        n.left = clone(t.left);
        n.right = clone(t.right);
        return n;
    }
}
