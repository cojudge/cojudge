import java.util.*;
class Marker {
    public int[] runRandomizedSet(String[] operations, int[] values) {
        Set<Integer> set = new HashSet<>();
        List<Integer> out = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("insert")) {
                out.add(set.add(values[i]) ? 1 : 0);
            } else if (op.equals("remove")) {
                out.add(set.remove(values[i]) ? 1 : 0);
            } else if (op.equals("getRandom")) {
                int v = set.iterator().next();
                out.add(v);
            }
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        if (output == null) return false;
        Set<Integer> set = new HashSet<>();
        int p = 0;
        for (int i = 1; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("insert")) {
                if (p >= output.length) return false;
                boolean had = set.contains(values[i]);
                int exp = had ? 0 : 1;
                if (output[p++] != exp) return false;
                set.add(values[i]);
            } else if (op.equals("remove")) {
                if (p >= output.length) return false;
                boolean had = set.contains(values[i]);
                int exp = had ? 1 : 0;
                if (output[p++] != exp) return false;
                set.remove(values[i]);
            } else if (op.equals("getRandom")) {
                if (p >= output.length) return false;
                if (!set.contains(output[p++])) return false;
            } else {
                return false;
            }
        }
        return p == output.length;
    }
}
