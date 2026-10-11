import java.util.*;
class Marker {
    public List<List<Integer>> getSkyline(int[][] buildings) {
        List<int[]> events = new ArrayList<>();
        for (int[] b : buildings) {
            events.add(new int[]{b[0], -b[2]});
            events.add(new int[]{b[1], b[2]});
        }
        events.sort((a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1]));
        TreeMap<Integer, Integer> active = new TreeMap<>();
        active.put(0, 1);
        List<List<Integer>> res = new ArrayList<>();
        int prev = 0;
        int i = 0;
        while (i < events.size()) {
            int x = events.get(i)[0];
            while (i < events.size() && events.get(i)[0] == x) {
                int h = events.get(i)[1];
                if (h < 0) active.put(-h, active.getOrDefault(-h, 0) + 1);
                else {
                    int c = active.getOrDefault(h, 0);
                    if (c <= 1) active.remove(h);
                    else active.put(h, c - 1);
                }
                i++;
            }
            int cur = active.lastKey();
            if (cur != prev) {
                res.add(Arrays.asList(x, cur));
                prev = cur;
            }
        }
        return res;
    }

    public boolean isCorrect(int[][] buildings, List<List<Integer>> output) {
        List<List<Integer>> expected = getSkyline(buildings);
        if (output == null || output.size() != expected.size()) return false;
        for (int r = 0; r < expected.size(); r++) {
            if (output.get(r) == null || output.get(r).size() != 2) return false;
            if (!output.get(r).get(0).equals(expected.get(r).get(0))) return false;
            if (!output.get(r).get(1).equals(expected.get(r).get(1))) return false;
        }
        return true;
    }
}
