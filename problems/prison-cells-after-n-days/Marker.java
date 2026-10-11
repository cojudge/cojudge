import java.util.*;
class Marker {
    public int[] prisonAfterNDays(int[] cells, int n) {
        int[] cur = cells.clone();
        Map<String, Integer> seen = new HashMap<>();
        int day = 0;
        while (day < n) {
            String key = Arrays.toString(cur);
            if (seen.containsKey(key)) {
                int period = day - seen.get(key);
                int rem = n - day;
                if (period > 0 && rem >= period) {
                    day += (rem / period) * period;
                    continue;
                }
            } else {
                seen.put(key, day);
            }
            int[] nxt = new int[8];
            for (int i = 1; i < 7; i++) nxt[i] = (cur[i - 1] == cur[i + 1]) ? 1 : 0;
            cur = nxt;
            day++;
        }
        return cur;
    }
    public boolean isCorrect(int[] cells, int n, int[] output) {
        return Arrays.equals(prisonAfterNDays(cells, n), output);
    }
}
