import java.util.*;
class Marker {
    public int[] runLogger(int[] timestamps, String[] messages) {
        Map<String, Integer> last = new HashMap<>();
        int n = Math.min(timestamps == null ? 0 : timestamps.length, messages == null ? 0 : messages.length);
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            int t = timestamps[i];
            String m = messages[i];
            Integer prev = last.get(m);
            if (prev == null || t - prev >= 10) {
                ans.add(1);
                last.put(m, t);
            } else {
                ans.add(0);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(int[] timestamps, String[] messages, int[] output) {
        return Arrays.equals(runLogger(timestamps, messages), output);
    }
}
