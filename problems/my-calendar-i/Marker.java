import java.util.*;
class Marker {
    public int[] runCalendar(String[] operations, int[][] args) {
        TreeMap<Integer, Integer> booked = new TreeMap<>();
        List<Integer> out = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            int s = args[i][0], e = args[i][1];
            boolean clash = false;
            Map.Entry<Integer, Integer> prev = booked.floorEntry(s);
            if (prev != null && prev.getValue() > s) clash = true;
            Map.Entry<Integer, Integer> next = booked.ceilingEntry(s);
            if (!clash && next != null && next.getKey() < e) clash = true;
            if (clash) out.add(0);
            else { booked.put(s, e); out.add(1); }
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return Arrays.equals(runCalendar(operations, args), output);
    }
}
