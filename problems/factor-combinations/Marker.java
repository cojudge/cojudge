import java.util.*;
class Marker {
    public List<List<Integer>> getFactors(int n) {
        List<List<Integer>> result = new ArrayList<>();
        search(n, 2, new ArrayList<>(), result);
        return result;
    }
    private void search(int remaining, int start, List<Integer> current, List<List<Integer>> result) {
        for (int f = start; (long) f * f <= remaining; f++) {
            if (remaining % f != 0) continue;
            current.add(f);
            List<Integer> row = new ArrayList<>(current);
            row.add(remaining / f);
            result.add(row);
            search(remaining / f, f, current, result);
            current.remove(current.size() - 1);
        }
    }
    public boolean isCorrect(int n, List<List<Integer>> output) {
        List<List<Integer>> expected = canonicalize(getFactors(n));
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
            int c = Integer.compare(a.get(i), b.get(i));
            if (c != 0) return c;
        }
        return Integer.compare(a.size(), b.size());
    }
}
