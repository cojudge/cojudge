import java.util.*;
class Marker {
    public int[][] runSummaryRanges(int[] values) {
        TreeMap<Integer, Integer> m = new TreeMap<>();
        if (values != null) {
            for (int v : values) {
                if (m.containsKey(v)) continue;
                Integer lo = m.floorKey(v);
                if (lo != null && m.get(lo) >= v) continue;
                int s = v, e = v;
                if (lo != null && m.get(lo) + 1 == v) {
                    s = lo;
                    e = Math.max(e, m.get(lo));
                    m.remove(lo);
                }
                while (true) {
                    Integer hi = m.ceilingKey(s);
                    if (hi != null && hi <= e + 1) {
                        e = Math.max(e, m.get(hi));
                        m.remove(hi);
                    } else break;
                }
                m.put(s, e);
            }
        }
        int[][] out = new int[m.size()][];
        int i = 0;
        for (Map.Entry<Integer, Integer> en : m.entrySet()) out[i++] = new int[]{en.getKey(), en.getValue()};
        return out;
    }
    public boolean isCorrect(int[] values, int[][] output) {
        return Arrays.deepEquals(runSummaryRanges(values), output);
    }
}
