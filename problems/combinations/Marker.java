import java.util.*;

class Marker {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        build(n, k, 1, new ArrayList<>(), result);
        return result;
    }

    private void build(int n, int k, int start, List<Integer> current, List<List<Integer>> result) {
        if (current.size() == k) {
            result.add(new ArrayList<>(current));
            return;
        }
        int remaining = k - current.size();
        for (int i = start; i <= n - remaining + 1; i++) {
            current.add(i);
            build(n, k, i + 1, current, result);
            current.remove(current.size() - 1);
        }
    }

    public boolean isCorrect(int n, int k, List<List<Integer>> output) {
        List<List<Integer>> expected = canonicalize(combine(n, k));
        List<List<Integer>> actual = canonicalize(output);
        return actual != null && expected.equals(actual);
    }

    private List<List<Integer>> canonicalize(List<List<Integer>> rows) {
        if (rows == null) return null;
        List<List<Integer>> result = new ArrayList<>();
        for (List<Integer> row : rows) {
            if (row == null) return null;
            List<Integer> copy = new ArrayList<>(row);
            Collections.sort(copy);
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