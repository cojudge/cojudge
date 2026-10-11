import java.util.*;
class Marker {
    private int idx;
    private List<Integer> flips;
    public List<Integer> flipMatchVoyage(TreeNode root, int[] voyage) {
        idx = 0;
        flips = new ArrayList<>();
        if (!dfs(root, voyage)) {
            List<Integer> fail = new ArrayList<>();
            fail.add(-1);
            return fail;
        }
        return new ArrayList<>(flips);
    }
    private boolean dfs(TreeNode node, int[] voyage) {
        if (node == null) return true;
        if (idx >= voyage.length || node.val != voyage[idx++]) return false;
        if (node.left != null && idx < voyage.length && node.left.val != voyage[idx]) {
            flips.add(node.val);
            if (!dfs(node.right, voyage)) return false;
            if (!dfs(node.left, voyage)) return false;
        } else {
            if (!dfs(node.left, voyage)) return false;
            if (!dfs(node.right, voyage)) return false;
        }
        return true;
    }
    public boolean isCorrect(TreeNode root, int[] voyage, List<Integer> output) {
        if (output == null) return false;
        List<Integer> exp = flipMatchVoyage(root, voyage);
        if (exp.size() != output.size()) return false;
        for (int i = 0; i < exp.size(); i++) {
            if (!exp.get(i).equals(output.get(i))) return false;
        }
        return true;
    }
}
