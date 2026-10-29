import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        TwoSum obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("TwoSum")) {
                obj = new TwoSum();
                result.add("null");
            } else if (op.equals("add")) {
                obj.add(values[i][0]);
                result.add("null");
            } else if (op.equals("find")) {
                result.add(String.valueOf(obj.find(values[i][0])));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        return solve(operations, values).equals(output);
    }

    static class TwoSum {
        private final Map<Integer, Integer> counts = new HashMap<>();
        void add(int number) {
            counts.put(number, counts.getOrDefault(number, 0) + 1);
        }
        boolean find(int value) {
            for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
                int x = e.getKey();
                int need = value - x;
                if (need == x) {
                    if (e.getValue() >= 2) return true;
                } else if (counts.containsKey(need)) return true;
            }
            return false;
        }
    }
}
