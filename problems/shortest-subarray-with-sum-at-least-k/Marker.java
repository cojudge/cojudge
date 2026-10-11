import java.util.*;
class Marker {
    public int shortestSubarray(int[] nums, int k) {
        int n = nums.length;
        long[] pref = new long[n + 1];
        for (int i = 0; i < n; i++) pref[i + 1] = pref[i] + nums[i];
        Deque<Integer> dq = new ArrayDeque<>();
        int best = Integer.MAX_VALUE;
        for (int i = 0; i <= n; i++) {
            while (!dq.isEmpty() && pref[i] - pref[dq.peekFirst()] >= k) {
                best = Math.min(best, i - dq.pollFirst());
            }
            while (!dq.isEmpty() && pref[dq.peekLast()] >= pref[i]) dq.pollLast();
            dq.offerLast(i);
        }
        return best == Integer.MAX_VALUE ? -1 : best;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return shortestSubarray(nums, k) == output;
    }
}
