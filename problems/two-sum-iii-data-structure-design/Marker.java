import java.util.*;
class Marker {
    public int[] runTwoSum(String[] operations, int[] values) {
        Map<Integer, Integer> counts = new HashMap<>();
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            if (operations[i].equals("add")) {
                counts.put(values[i], counts.getOrDefault(values[i], 0) + 1);
            } else if (operations[i].equals("find")) {
                ans.add(find(counts, values[i]) ? 1 : 0);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    private boolean find(Map<Integer, Integer> counts, int value) {
        for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
            int x = e.getKey();
            int need = value - x;
            if (need == x) {
                if (e.getValue() >= 2) return true;
            } else if (counts.containsKey(need)) return true;
        }
        return false;
    }
    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runTwoSum(operations, values), output);
    }
}
