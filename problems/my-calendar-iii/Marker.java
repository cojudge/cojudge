import java.util.*;
class Marker {
    public int[] runCalendarThree(String[] operations, int[][] args) {
        TreeMap<Integer, Integer> delta = new TreeMap<>();
        List<Integer> out = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            int s = args[i][0], e = args[i][1];
            delta.put(s, delta.getOrDefault(s, 0) + 1);
            delta.put(e, delta.getOrDefault(e, 0) - 1);
            int cur = 0, best = 0;
            for (int v : delta.values()) { cur += v; best = Math.max(best, cur); }
            out.add(best);
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return Arrays.equals(runCalendarThree(operations, args), output);
    }
}
