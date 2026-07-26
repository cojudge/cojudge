import java.util.*;

class Marker {
    public int[][] permute(int[] nums) {
        List<int[]> result = new ArrayList<>();
        buildPermutations(nums, new boolean[nums.length], new int[nums.length], 0, result);
        return result.toArray(new int[result.size()][]);
    }

    private void buildPermutations(int[] nums, boolean[] used, int[] current, int depth,
                                   List<int[]> result) {
        if (depth == nums.length) {
            result.add(current.clone());
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            current[depth] = nums[i];
            buildPermutations(nums, used, current, depth + 1, result);
            used[i] = false;
        }
    }

    public boolean isCorrect(int[] nums, int[][] output) {
        List<List<Integer>> expected = canonicalize(permute(nums.clone()));
        List<List<Integer>> actual = canonicalize(output);
        return actual != null && expected.equals(actual);
    }

    private List<List<Integer>> canonicalize(int[][] values) {
        if (values == null) return null;
        List<List<Integer>> result = new ArrayList<>();
        for (int[] row : values) {
            if (row == null) return null;
            List<Integer> copy = new ArrayList<>(row.length);
            for (int value : row) copy.add(value);
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
