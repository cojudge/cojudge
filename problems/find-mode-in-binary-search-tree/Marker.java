import java.util.*;
class Marker {
    public int[] findMode(TreeNode root) {
        if (root == null) return new int[0];
        Map<Integer,Integer> freq = new HashMap<>();
        Deque<TreeNode> st = new ArrayDeque<>();
        st.push(root);
        while (!st.isEmpty()) {
            TreeNode n = st.pop();
            if (n == null) continue;
            freq.put(n.val, freq.getOrDefault(n.val, 0) + 1);
            if (n.left != null) st.push(n.left);
            if (n.right != null) st.push(n.right);
        }
        int mx = 0;
        for (int v : freq.values()) mx = Math.max(mx, v);
        List<Integer> modes = new ArrayList<>();
        for (Map.Entry<Integer,Integer> e : freq.entrySet()) if (e.getValue() == mx) modes.add(e.getKey());
        Collections.sort(modes);
        return modes.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(TreeNode root, int[] output) {
        if (output == null) return false;
        int[] exp = findMode(cloneTree(root));
        Arrays.sort(exp);
        int[] act = output.clone();
        Arrays.sort(act);
        return Arrays.equals(exp, act);
    }
    private TreeNode cloneTree(TreeNode n) {
        if (n == null) return null;
        TreeNode c = new TreeNode(n.val);
        c.left = cloneTree(n.left);
        c.right = cloneTree(n.right);
        return c;
    }
}
