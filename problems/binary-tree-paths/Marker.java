import java.util.*;
class Marker {
    public List<String> binaryTreePaths(TreeNode root) {
        List<String> result = new ArrayList<>();
        build(root, new StringBuilder(), result);
        return result;
    }
    private void build(TreeNode node, StringBuilder path, List<String> result) {
        if (node == null) return;
        int len = path.length();
        if (len > 0) path.append("->");
        path.append(node.val);
        if (node.left == null && node.right == null) {
            result.add(path.toString());
        } else {
            build(node.left, path, result);
            build(node.right, path, result);
        }
        path.setLength(len);
    }
    public boolean isCorrect(TreeNode root, List<String> output) {
        if (output == null || output.stream().anyMatch(Objects::isNull)) return false;
        List<String> expected = binaryTreePaths(cloneTree(root));
        List<String> a = new ArrayList<>(expected);
        List<String> b = new ArrayList<>(output);
        Collections.sort(a);
        Collections.sort(b);
        return a.equals(b);
    }
    private TreeNode cloneTree(TreeNode node) {
        if (node == null) return null;
        TreeNode c = new TreeNode(node.val);
        c.left = cloneTree(node.left);
        c.right = cloneTree(node.right);
        return c;
    }
}
