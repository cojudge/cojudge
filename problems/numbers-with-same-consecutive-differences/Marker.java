import java.util.*;
class Marker {
    public List<Integer> numsSameConsecDiff(int n, int k) {
        List<Integer> res = new ArrayList<>();
        if (n == 1) {
            for (int d = 0; d <= 9; d++) res.add(d);
            return res;
        }
        for (int start = 1; start <= 9; start++) dfs(start, 1, n, k, res);
        Collections.sort(res);
        return res;
    }
    private void dfs(int cur, int len, int n, int k, List<Integer> res) {
        if (len == n) {
            res.add(cur);
            return;
        }
        int last = cur % 10;
        Set<Integer> next = new TreeSet<>();
        if (last + k <= 9) next.add(last + k);
        if (last - k >= 0) next.add(last - k);
        for (int d : next) dfs(cur * 10 + d, len + 1, n, k, res);
    }
    public boolean isCorrect(int n, int k, List<Integer> output) {
        if (output == null) return false;
        List<Integer> exp = numsSameConsecDiff(n, k);
        List<Integer> got = new ArrayList<>(output);
        Collections.sort(got);
        return exp.equals(got);
    }
}
