import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Arrays;

class Marker {
    public int[] runLruCache(String[] operations, int[][] args) {
        int capacity = args[0][0];
        LinkedHashMap<Integer, Integer> cache = new LinkedHashMap<>(16, 0.75f, true);
        List<Integer> results = new ArrayList<>();

        for (int i = 1; i < operations.length; i++) {
            if (operations[i].equals("get")) {
                Integer value = cache.get(args[i][0]);
                results.add(value == null ? -1 : value);
            } else if (operations[i].equals("put")) {
                cache.put(args[i][0], args[i][1]);
                if (cache.size() > capacity) {
                    Iterator<Map.Entry<Integer, Integer>> iterator = cache.entrySet().iterator();
                    iterator.next();
                    iterator.remove();
                }
            }
        }

        int[] output = new int[results.size()];
        for (int i = 0; i < results.size(); i++) output[i] = results.get(i);
        return output;
    }

    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return output != null && Arrays.equals(runLruCache(operations, args), output);
    }
}
