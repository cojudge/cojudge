import java.util.*;
class Marker {
    public String rearrangeString(String s, int k) {
        if (s == null || s.isEmpty() || k <= 1) return s == null ? "" : s;
        Map<Character, Integer> cnt = new HashMap<>();
        for (char c : s.toCharArray()) cnt.put(c, cnt.getOrDefault(c, 0) + 1);
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(b[0], a[0]));
        for (Map.Entry<Character, Integer> e : cnt.entrySet()) pq.offer(new int[]{e.getValue(), e.getKey()});
        StringBuilder sb = new StringBuilder();
        Queue<int[]> wait = new ArrayDeque<>();
        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            sb.append((char) cur[1]);
            cur[0]--;
            wait.offer(cur);
            if (wait.size() == k) {
                int[] front = wait.poll();
                if (front[0] > 0) pq.offer(front);
            }
        }
        return sb.length() == s.length() ? sb.toString() : "";
    }
    public boolean isCorrect(String s, int k, String output) {
        if (output == null) return false;
        String exp = rearrangeString(s, k);
        if (exp.isEmpty()) return output.isEmpty();
        if (output.length() != s.length()) return false;
        int[] a = new int[256], b = new int[256];
        for (char c : s.toCharArray()) a[c]++;
        for (char c : output.toCharArray()) b[c]++;
        if (!Arrays.equals(a, b)) return false;
        Map<Character, Integer> last = new HashMap<>();
        for (int i = 0; i < output.length(); i++) {
            char c = output.charAt(i);
            if (last.containsKey(c) && i - last.get(c) < k) return false;
            last.put(c, i);
        }
        return true;
    }
}
