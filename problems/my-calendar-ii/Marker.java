import java.util.*;
class Marker {
    public int[] runCalendarTwo(String[] operations, int[][] args) {
        List<int[]> booked = new ArrayList<>();
        List<int[]> overlaps = new ArrayList<>();
        List<Integer> out = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            int s = args[i][0], e = args[i][1];
            boolean bad = false;
            for (int[] o : overlaps) {
                if (Math.max(s, o[0]) < Math.min(e, o[1])) { bad = true; break; }
            }
            if (bad) { out.add(0); continue; }
            for (int[] b : booked) {
                int ns = Math.max(s, b[0]), ne = Math.min(e, b[1]);
                if (ns < ne) overlaps.add(new int[]{ns, ne});
            }
            booked.add(new int[]{s, e});
            out.add(1);
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return Arrays.equals(runCalendarTwo(operations, args), output);
    }
}
