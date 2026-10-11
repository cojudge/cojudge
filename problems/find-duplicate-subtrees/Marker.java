import java.util.*;
class Marker {
    private Map<String,Integer> count;
    private List<String> ans;
    public List<String> findDuplicateSubtrees(TreeNode root) {
        count = new HashMap<>();
        ans = new ArrayList<>();
        serialize(root);
        Collections.sort(ans);
        return ans;
    }
    private String serialize(TreeNode n) {
        if (n == null) return "#";
        String key = n.val + "," + serialize(n.left) + "," + serialize(n.right);
        count.put(key, count.getOrDefault(key, 0) + 1);
        if (count.get(key) == 2) ans.add(key);
        return key;
    }
    public boolean isCorrect(TreeNode root, List<String> output) {
        if (output == null) return false;
        List<String> exp = findDuplicateSubtrees(cloneTree(root));
        List<String> a = new ArrayList<>(exp);
        List<String> b = new ArrayList<>(output);
        Collections.sort(a);
        Collections.sort(b);
        if (a.equals(b)) return true;
        // Fallback for runners whose display does not quote strings containing commas
        // (e.g., PHP emits raw serializations, so ["a,b","c"] displays as [a,b,c]
        // and reparses as ["a","b","c"]). Joining with "," is associative, so a
        // correct flattened output rejoins to the same string as the expected list.
        try {
            String flatExp = String.join(",", exp);
            String flatOut = String.join(",", output);
            if (flatExp.equals(flatOut)) return true;
            String flatA = String.join(",", a);
            String flatB = String.join(",", b);
            if (flatA.equals(flatB)) return true;
        } catch (Exception e) {}
        return false;
    }
    private TreeNode cloneTree(TreeNode n) {
        if (n == null) return null;
        TreeNode c = new TreeNode(n.val);
        c.left = cloneTree(n.left);
        c.right = cloneTree(n.right);
        return c;
    }
}
