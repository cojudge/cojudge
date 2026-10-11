import java.util.*;
class Marker {
    public int[] runHitCounter(String[] operations, int[] timestamps) {
        Deque<Integer> q = new ArrayDeque<>();
        List<Integer> ans = new ArrayList<>();
        int n = Math.min(operations == null ? 0 : operations.length, timestamps == null ? 0 : timestamps.length);
        for (int i = 0; i < n; i++) {
            String op = operations[i];
            int t = timestamps[i];
            if (op.equals("hit")) {
                q.offerLast(t);
            } else if (op.equals("getHits")) {
                while (!q.isEmpty() && q.peekFirst() <= t - 300) q.pollFirst();
                ans.add(q.size());
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[] timestamps, int[] output) {
        return Arrays.equals(runHitCounter(operations, timestamps), output);
    }
}
