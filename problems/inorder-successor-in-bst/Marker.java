class Marker {
    public int inorderSuccessor(TreeNode root, int p) {
        int succ = -1;
        TreeNode cur = root;
        while (cur != null) {
            if (p < cur.val) {
                succ = cur.val;
                cur = cur.left;
            } else {
                cur = cur.right;
            }
        }
        return succ;
    }
    public boolean isCorrect(TreeNode root, int p, int output) {
        return output == inorderSuccessor(root, p);
    }
}
