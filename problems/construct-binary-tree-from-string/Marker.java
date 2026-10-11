import java.util.*;
class Marker {
    private int pos;
    private String str;
    public TreeNode str2tree(String s) {
        if (s == null || s.isEmpty()) return null;
        str = s;
        pos = 0;
        return parse();
    }
    private TreeNode parse() {
        int start = pos;
        if (pos < str.length() && str.charAt(pos) == '-') pos++;
        while (pos < str.length() && Character.isDigit(str.charAt(pos))) pos++;
        TreeNode node = new TreeNode(Integer.parseInt(str.substring(start, pos)));
        if (pos < str.length() && str.charAt(pos) == '(') {
            pos++;
            node.left = parse();
            pos++;
        }
        if (pos < str.length() && str.charAt(pos) == '(') {
            pos++;
            node.right = parse();
            pos++;
        }
        return node;
    }
    private boolean equalTrees(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        return a.val == b.val && equalTrees(a.left, b.left) && equalTrees(a.right, b.right);
    }
    public boolean isCorrect(String s, TreeNode output) {
        return equalTrees(str2tree(s), output);
    }
}
