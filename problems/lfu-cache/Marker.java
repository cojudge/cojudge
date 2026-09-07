import java.util.*;

class Marker {
    public int[] runLfuCache(String[] operations, int[][] args) {
        int capacity = args[0][0];
        Map<Integer, Integer> values = new HashMap<>();
        Map<Integer, Integer> freqs = new HashMap<>();
        Map<Integer, LinkedHashSet<Integer>> groups = new HashMap<>();
        int minFreq = 0;
        List<Integer> results = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            if (operations[i].equals("get")) {
                int key = args[i][0];
                if (!values.containsKey(key)) {
                    results.add(-1);
                } else {
                    int f = freqs.get(key);
                    groups.get(f).remove(key);
                    if (f == minFreq && groups.get(f).isEmpty()) minFreq++;
                    freqs.put(key, f + 1);
                    groups.computeIfAbsent(f + 1, k -> new LinkedHashSet<>()).add(key);
                    results.add(values.get(key));
                }
            } else if (operations[i].equals("put")) {
                int key = args[i][0], value = args[i][1];
                if (capacity == 0) continue;
                if (values.containsKey(key)) {
                    values.put(key, value);
                    int f = freqs.get(key);
                    groups.get(f).remove(key);
                    if (f == minFreq && groups.get(f).isEmpty()) minFreq++;
                    freqs.put(key, f + 1);
                    groups.computeIfAbsent(f + 1, k -> new LinkedHashSet<>()).add(key);
                } else {
                    if (values.size() == capacity) {
                        LinkedHashSet<Integer> g = groups.get(minFreq);
                        int evict = g.iterator().next();
                        g.remove(evict);
                        values.remove(evict);
                        freqs.remove(evict);
                    }
                    values.put(key, value);
                    freqs.put(key, 1);
                    groups.computeIfAbsent(1, k -> new LinkedHashSet<>()).add(key);
                    minFreq = 1;
                }
            }
        }
        int[] out = new int[results.size()];
        for (int i = 0; i < out.length; i++) out[i] = results.get(i);
        return out;
    }

    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return output != null && Arrays.equals(runLfuCache(operations, args), output);
    }
}
