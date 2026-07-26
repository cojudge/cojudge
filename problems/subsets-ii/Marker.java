import java.util.*;

class Marker {
    public int[][] subsetsWithDup(int[] nums) {
        int[] sorted = nums.clone();
        Arrays.sort(sorted);
        List<int[]> result = new ArrayList<>();
        buildSubsets(sorted, 0, new ArrayList<>(), result);
        return result.toArray(new int[result.size()][]);
    }

    private void buildSubsets(int[] nums, int start, List<Integer> current, List<int[]> result) {
        int[] subset = new int[current.size()];
        for (int i = 0; i < current.size(); i++) subset[i] = current.get(i);
        result.add(subset);

        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;
            current.add(nums[i]);
            buildSubsets(nums, i + 1, current, result);
            current.remove(current.size() - 1);
        }
    }

    public boolean isCorrect(int[] nums, int[][] output) {
        List<List<Integer>> expected = canonicalize(subsetsWithDup(nums.clone()));
        List<List<Integer>> actual = canonicalize(output);
        return actual != null && expected.equals(actual);
    }

    private List<List<Integer>> canonicalize(int[][] values) {
        if (values == null) return null;
        List<List<Integer>> result = new ArrayList<>();
        for (int[] row : values) {
            if (row == null) return null;
            int[] sorted = row.clone();
            Arrays.sort(sorted);
            List<Integer> copy = new ArrayList<>(sorted.length);
            for (int value : sorted) copy.add(value);
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
