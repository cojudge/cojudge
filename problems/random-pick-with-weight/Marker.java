import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        WeightedPicker obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("WeightedPicker")) {
                obj = new WeightedPicker(values[i]);
                result.add("null");
            } else if (op.equals("pickIndex")) {
                result.add(String.valueOf(obj.pickIndex()));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        int[] w = null;
        boolean live = false;
        Set<Integer> seen = new HashSet<>();
        int pickCount = 0;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String got = output.get(i).trim();
            if (op.equals("WeightedPicker")) {
                if (!got.equals("null")) return false;
                if (w != null && pickCount >= 500 && !covers(w, seen)) return false;
                if (values[i] == null || values[i].length < 1) return false;
                w = values[i].clone();
                seen.clear();
                pickCount = 0;
                live = true;
            } else if (op.equals("pickIndex")) {
                if (!live) return false;
                int idx;
                try {
                    idx = Integer.parseInt(got);
                } catch (NumberFormatException e) {
                    return false;
                }
                if (idx < 0 || idx >= w.length) return false;
                seen.add(idx);
                pickCount++;
            } else {
                return false;
            }
        }
        if (!live) return false;
        if (pickCount >= 500 && !covers(w, seen)) return false;
        return true;
    }

    private boolean covers(int[] w, Set<Integer> seen) {
        for (int i = 0; i < w.length; i++) {
            if (w[i] > 0 && !seen.contains(i)) return false;
        }
        return true;
    }

    static class WeightedPicker {
        private final int[] pref;
        private final int total;
        private final Random rand = new Random();
        WeightedPicker(int[] w) {
            pref = new int[w.length];
            int s = 0;
            for (int i = 0; i < w.length; i++) {
                s += w[i];
                pref[i] = s;
            }
            total = s;
        }
        int pickIndex() {
            int t = rand.nextInt(total);
            int lo = 0, hi = pref.length - 1;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (pref[mid] > t) hi = mid;
                else lo = mid + 1;
            }
            return lo;
        }
    }
}
