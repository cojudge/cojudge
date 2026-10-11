import java.util.*;
class Marker {
    public int kEmptySlots(int[] bulbs, int k) {
        int n = bulbs.length;
        int[] days = new int[n + 1];
        for (int d = 0; d < n; d++) days[bulbs[d]] = d + 1;
        int ans = Integer.MAX_VALUE;
        int left = 1, right = left + k + 1;
        int i = left + 1;
        while (right <= n) {
            if (i > right - 1) {
                ans = Math.min(ans, Math.max(days[left], days[right]));
                left = right;
                right = left + k + 1;
                i = left + 1;
            } else if (days[i] < Math.max(days[left], days[right])) {
                left = i;
                right = left + k + 1;
                i = left + 1;
            } else {
                i++;
            }
            if (right > n) break;
        }
        return ans == Integer.MAX_VALUE ? -1 : ans;
    }
    public boolean isCorrect(int[] bulbs, int k, int output) {
        return kEmptySlots(bulbs, k) == output;
    }
}
