import java.util.*;
class Marker {
    public int[] runWeightedPick(int[] weights, int[] calls) {
        int n = weights.length;
        long[] pref = new long[n];
        long total = 0;
        for (int i = 0; i < n; i++) {
            total += weights[i];
            pref[i] = total;
        }
        int[] ans = new int[calls.length];
        for (int j = 0; j < calls.length; j++) {
            long t = ((calls[j] % total) + total) % total;
            int lo = 0, hi = n - 1;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (pref[mid] > t) hi = mid;
                else lo = mid + 1;
            }
            ans[j] = lo;
        }
        return ans;
    }
    public boolean isCorrect(int[] weights, int[] calls, int[] output) {
        if (output == null || output.length != calls.length) return false;
        for (int v : output) {
            if (v < 0 || v >= weights.length) return false;
        }
        return Arrays.equals(runWeightedPick(weights, calls), output);
    }
}
