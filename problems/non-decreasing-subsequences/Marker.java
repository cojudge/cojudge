import java.util.*;
class Marker {
    public List<List<Integer>> findSubsequences(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), res);
        return res;
    }
    private void backtrack(int[] nums, int idx, List<Integer> cur, List<List<Integer>> res) {
        if (cur.size() >= 2) res.add(new ArrayList<>(cur));
        Set<Integer> used = new HashSet<>();
        for (int i = idx; i < nums.length; i++) {
            if (!cur.isEmpty() && nums[i] < cur.get(cur.size() - 1)) continue;
            if (!used.add(nums[i])) continue;
            cur.add(nums[i]);
            backtrack(nums, i + 1, cur, res);
            cur.remove(cur.size() - 1);
        }
    }
    public boolean isCorrect(int[] nums, List<List<Integer>> output) {
        if (output == null) return false;
        List<List<Integer>> exp = findSubsequences(nums.clone());
        List<String> a = new ArrayList<>();
        List<String> b = new ArrayList<>();
        for (List<Integer> l : exp) a.add(l.toString());
        for (List<Integer> l : output) {
            if (l == null) return false;
            b.add(l.toString());
        }
        Collections.sort(a);
        Collections.sort(b);
        return a.equals(b);
    }
}
