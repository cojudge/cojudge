import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        MyHashMap obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("MyHashMap")) {
                obj = new MyHashMap();
                result.add("null");
            } else if (op.equals("put")) {
                obj.put(values[i][0], values[i][1]);
                result.add("null");
            } else if (op.equals("get")) {
                result.add(String.valueOf(obj.get(values[i][0])));
            } else if (op.equals("remove")) {
                obj.remove(values[i][0]);
                result.add("null");
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        return solve(operations, values).equals(output);
    }

    static class MyHashMap {
        private final Map<Integer, Integer> map = new HashMap<>();
        void put(int key, int value) {
            map.put(key, value);
        }
        int get(int key) {
            return map.getOrDefault(key, -1);
        }
        void remove(int key) {
            map.remove(key);
        }
    }
}
