import java.util.*;
class Marker {
    public int[] exclusiveTime(int n, String[] logs) {
        int[] res = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        int prev = 0;
        for (String log : logs) {
            String[] p = log.split(":");
            int id = Integer.parseInt(p[0]);
            String type = p[1];
            int t = Integer.parseInt(p[2]);
            if (type.equals("start")) {
                if (!st.isEmpty()) res[st.peek()] += t - prev;
                st.push(id);
                prev = t;
            } else {
                res[st.pop()] += t - prev + 1;
                prev = t + 1;
            }
        }
        return res;
    }
    public boolean isCorrect(int n, String[] logs, int[] output) {
        return output != null && Arrays.equals(exclusiveTime(n, logs), output);
    }
}
