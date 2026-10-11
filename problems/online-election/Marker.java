import java.util.*;
class Marker {
    public int[] runElection(int[] persons, int[] times, int[] queries) {
        int n = persons.length;
        int[] leaders = new int[n];
        Map<Integer, Integer> count = new HashMap<>();
        int best = -1, bestCount = 0;
        for (int i = 0; i < n; i++) {
            int p = persons[i];
            int c = count.getOrDefault(p, 0) + 1;
            count.put(p, c);
            if (c >= bestCount) { bestCount = c; best = p; }
            leaders[i] = best;
        }
        int[] ans = new int[queries.length];
        for (int j = 0; j < queries.length; j++) {
            int t = queries[j];
            int lo = 0, hi = n - 1, idx = 0;
            while (lo <= hi) {
                int mid = (lo + hi) >>> 1;
                if (times[mid] <= t) { idx = mid; lo = mid + 1; }
                else hi = mid - 1;
            }
            ans[j] = leaders[idx];
        }
        return ans;
    }
    public boolean isCorrect(int[] persons, int[] times, int[] queries, int[] output) {
        return output != null && Arrays.equals(runElection(persons, times, queries), output);
    }
}
