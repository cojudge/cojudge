import java.util.*;
class Marker {
    private Map<Integer, Integer> postIdx;
    private int prePos;
    public TreeNode constructFromPrePost(int[] preorder, int[] postorder) {
        postIdx = new HashMap<>();
        for (int i = 0; i < postorder.length; i++) postIdx.put(postorder[i], i);
        prePos = 0;
        return build(preorder, 0, postorder.length - 1);
    }
    private TreeNode build(int[] pre, int l, int r) {
        if (l > r) return null;
        TreeNode root = new TreeNode(pre[prePos++]);
        if (l == r) return root;
        int leftRootVal = pre[prePos];
        int m = postIdx.get(leftRootVal);
        root.left = build(pre, l, m);
        root.right = build(pre, m + 1, r - 1);
        return root;
    }
    private void collectPre(TreeNode node, List<Integer> out) {
        if (node == null) return;
        out.add(node.val);
        collectPre(node.left, out);
        collectPre(node.right, out);
    }
    private void collectPost(TreeNode node, List<Integer> out) {
        if (node == null) return;
        collectPost(node.left, out);
        collectPost(node.right, out);
        out.add(node.val);
    }
    public boolean isCorrect(int[] preorder, int[] postorder, TreeNode output) {
        List<Integer> wantPre = new ArrayList<>();
        List<Integer> wantPost = new ArrayList<>();
        for (int x : preorder) wantPre.add(x);
        for (int x : postorder) wantPost.add(x);
        List<Integer> gotPre = new ArrayList<>();
        List<Integer> gotPost = new ArrayList<>();
        collectPre(output, gotPre);
        collectPost(output, gotPost);
        return wantPre.equals(gotPre) && wantPost.equals(gotPost);
    }
}
