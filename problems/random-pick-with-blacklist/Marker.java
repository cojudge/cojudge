import java.util.*;
class Marker {
    public int[] runBlacklist(int n, int[] blacklist, int[] calls) {
        int sz = n - blacklist.length;
        if (sz <= 0) return new int[calls.length];
        Set<Integer> black = new HashSet<>();
        for (int b : blacklist) black.add(b);
        Map<Integer, Integer> map = new HashMap<>();
        int w = n - 1;
        for (int b : blacklist) {
            if (b < sz) {
                while (black.contains(w)) w--;
                map.put(b, w);
                w--;
            }
        }
        int[] ans = new int[calls.length];
        for (int i = 0; i < calls.length; i++) {
            long t = ((calls[i] % (long) sz) + sz) % sz;
            int idx = (int) t;
            ans[i] = map.getOrDefault(idx, idx);
        }
        return ans;
    }
    public boolean isCorrect(int n, int[] blacklist, int[] calls, int[] output) {
        if (output == null || output.length != calls.length) return false;
        Set<Integer> black = new HashSet<>();
        for (int b : blacklist) black.add(b);
        for (int v : output) {
            if (v < 0 || v >= n) return false;
            if (black.contains(v)) return false;
        }
        return true;
    }
}
