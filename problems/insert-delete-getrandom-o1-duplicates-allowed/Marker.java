import java.util.*;
class Marker {
    public int[] runRandomizedCollection(String[] operations, int[] values) {
        Map<Integer, Integer> counts = new HashMap<>();
        List<Integer> out = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("insert")) {
                int c = counts.getOrDefault(values[i], 0);
                out.add(c == 0 ? 1 : 0);
                counts.put(values[i], c + 1);
            } else if (op.equals("remove")) {
                int c = counts.getOrDefault(values[i], 0);
                if (c > 0) {
                    out.add(1);
                    if (c == 1) counts.remove(values[i]);
                    else counts.put(values[i], c - 1);
                } else {
                    out.add(0);
                }
            } else if (op.equals("getRandom")) {
                int v = counts.keySet().iterator().next();
                out.add(v);
            }
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        if (output == null) return false;
        Map<Integer, Integer> counts = new HashMap<>();
        int p = 0;
        for (int i = 1; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("insert")) {
                if (p >= output.length) return false;
                int exp = counts.getOrDefault(values[i], 0) == 0 ? 1 : 0;
                if (output[p++] != exp) return false;
                counts.put(values[i], counts.getOrDefault(values[i], 0) + 1);
            } else if (op.equals("remove")) {
                if (p >= output.length) return false;
                int c = counts.getOrDefault(values[i], 0);
                int exp = c > 0 ? 1 : 0;
                if (output[p++] != exp) return false;
                if (c == 1) counts.remove(values[i]);
                else if (c > 1) counts.put(values[i], c - 1);
            } else if (op.equals("getRandom")) {
                if (p >= output.length) return false;
                if (counts.getOrDefault(output[p++], 0) <= 0) return false;
            } else {
                return false;
            }
        }
        return p == output.length;
    }
}
