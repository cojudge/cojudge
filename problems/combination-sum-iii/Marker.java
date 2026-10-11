import java.util.*;
class Marker {
    public List<List<Integer>> combinationSum3(int k, int n) {
        List<List<Integer>> res = new ArrayList<>();
        build(k, n, 1, 0, new ArrayList<>(), res);
        return res;
    }

    private void build(int k, int n, int start, int sum, List<Integer> cur, List<List<Integer>> res) {
        if (cur.size() == k) {
            if (sum == n) res.add(new ArrayList<>(cur));
            return;
        }
        for (int d = start; d <= 9; d++) {
            if (sum + d > n) break;
            cur.add(d);
            build(k, n, d + 1, sum + d, cur, res);
            cur.remove(cur.size() - 1);
        }
    }

    public boolean isCorrect(int k, int n, List<List<Integer>> output) {
        List<List<Integer>> expected = canonicalize(combinationSum3(k, n));
        List<List<Integer>> actual = canonicalize(output);
        return actual != null && expected.equals(actual);
    }

    private List<List<Integer>> canonicalize(List<List<Integer>> rows) {
        if (rows == null) return null;
        List<List<Integer>> res = new ArrayList<>();
        for (List<Integer> row : rows) {
            if (row == null) return null;
            List<Integer> copy = new ArrayList<>(row);
            Collections.sort(copy);
            res.add(copy);
        }
        res.sort(this::compareRows);
        return res;
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
