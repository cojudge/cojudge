import java.util.*;

class Marker {
    public int[][] subsets(int[] nums) {
        int[] values = nums.clone();
        Arrays.sort(values);
        List<int[]> result = new ArrayList<>();
        buildSubsets(values, 0, new ArrayList<>(), result);
        return result.toArray(new int[result.size()][]);
    }

    public boolean isCorrect(int[] nums, int[][] output) {
        return Objects.equals(canonicalize(subsets(nums)), canonicalize(output));
    }

    private void buildSubsets(int[] nums, int index, List<Integer> current, List<int[]> result) {
        if (index == nums.length) {
            result.add(toArray(current));
            return;
        }

        buildSubsets(nums, index + 1, current, result);
        current.add(nums[index]);
        buildSubsets(nums, index + 1, current, result);
        current.remove(current.size() - 1);
    }

    private int[] toArray(List<Integer> values) {
        int[] result = new int[values.size()];
        for (int i = 0; i < values.size(); i++) result[i] = values.get(i);
        return result;
    }

    private List<List<Integer>> canonicalize(int[][] rows) {
        if (rows == null) return null;
        List<List<Integer>> result = new ArrayList<>();
        for (int[] row : rows) {
            if (row == null) return null;
            int[] copy = row.clone();
            Arrays.sort(copy);
            List<Integer> normalized = new ArrayList<>(copy.length);
            for (int value : copy) normalized.add(value);
            result.add(normalized);
        }
        result.sort(this::compareRows);
        return result;
    }

    private int compareRows(List<Integer> a, List<Integer> b) {
        int length = Math.min(a.size(), b.size());
        for (int i = 0; i < length; i++) {
            int comparison = Integer.compare(a.get(i), b.get(i));
            if (comparison != 0) return comparison;
        }
        return Integer.compare(a.size(), b.size());
    }
}
