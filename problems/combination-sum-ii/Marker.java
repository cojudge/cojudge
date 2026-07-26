import java.util.*;

class Marker {
    public int[][] combinationSum2(int[] candidates, int target) {
        int[] values = candidates.clone();
        Arrays.sort(values);
        List<int[]> result = new ArrayList<>();
        search(values, target, 0, new ArrayList<>(), result);
        return result.toArray(new int[result.size()][]);
    }

    public boolean isCorrect(int[] candidates, int target, int[][] output) {
        return Objects.equals(canonicalize(combinationSum2(candidates, target)), canonicalize(output));
    }

    private void search(int[] candidates, int remaining, int start, List<Integer> current,
                        List<int[]> result) {
        if (remaining == 0) {
            result.add(toArray(current));
            return;
        }

        for (int i = start; i < candidates.length && candidates[i] <= remaining; i++) {
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            current.add(candidates[i]);
            search(candidates, remaining - candidates[i], i + 1, current, result);
            current.remove(current.size() - 1);
        }
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
