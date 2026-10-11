import java.util.*;
class Marker {
    public int[] runRecentCalls(int[] pings) {
        int[] ans = new int[pings.length];
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < pings.length; i++) {
            q.addLast(pings[i]);
            while (!q.isEmpty() && q.peekFirst() < pings[i] - 3000) q.pollFirst();
            ans[i] = q.size();
        }
        return ans;
    }
    public boolean isCorrect(int[] pings, int[] output) {
        return Arrays.equals(runRecentCalls(pings), output);
    }
}
