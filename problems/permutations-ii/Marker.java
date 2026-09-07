import java.util.*;

class Marker {
    public List<List<Integer>> permuteUnique(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        List<List<Integer>> result = new ArrayList<>();
        build(sorted, new boolean[sorted.length], new ArrayList<>(), result);
        return result;
    }

    private void build(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> result) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;
            used[i] = true;
            current.add(nums[i]);
            build(nums, used, current, result);
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }

    public boolean isCorrect(int[] nums, List<List<Integer>> output) {
        List<List<Integer>> expected = canonicalize(permuteUnique(nums.clone()));
        List<List<Integer>> actual = canonicalize(output);
        return actual != null && expected.equals(actual);
    }

    private List<List<Integer>> canonicalize(List<List<Integer>> rows) {
        if (rows == null) return null;
        List<List<Integer>> result = new ArrayList<>();
        for (List<Integer> row : rows) {
            if (row == null) return null;
            List<Integer> copy = new ArrayList<>(row);
            result.add(copy);
        }
        result.sort(this::compareRows);
        return result;
    }

    private int compareRows(List<Integer> a, List<Integer> b) {
        int limit = Math.min(a.size(), b.size());
        for (int i = 0; i < limit; i++) {
            int comparison = Integer.compare(a.get(i), b.get(i));
            if (comparison != 0) return comparison;
        }
        return Integer.compare(a.size(), b.size());
    }
}