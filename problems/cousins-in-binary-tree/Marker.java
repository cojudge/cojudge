class Marker {
    private int depthX;
    private int depthY;
    private TreeNode parentX;
    private TreeNode parentY;
    public boolean isCousins(TreeNode root, int x, int y) {
        depthX = -1;
        depthY = -1;
        parentX = null;
        parentY = null;
        walk(root, null, 0, x, y);
        return depthX != -1 && depthX == depthY && parentX != parentY;
    }
    private void walk(TreeNode node, TreeNode parent, int depth, int x, int y) {
        if (node == null) {
            return;
        }
        if (node.val == x) {
            depthX = depth;
            parentX = parent;
        }
        if (node.val == y) {
            depthY = depth;
            parentY = parent;
        }
        walk(node.left, node, depth + 1, x, y);
        walk(node.right, node, depth + 1, x, y);
    }
    public boolean isCorrect(TreeNode root, int x, int y, boolean output) {
        return isCousins(root, x, y) == output;
    }
}
