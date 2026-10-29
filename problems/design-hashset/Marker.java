import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        MyHashSet obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("MyHashSet")) {
                obj = new MyHashSet();
                result.add("null");
            } else if (op.equals("add")) {
                obj.add(values[i][0]);
                result.add("null");
            } else if (op.equals("remove")) {
                obj.remove(values[i][0]);
                result.add("null");
            } else if (op.equals("contains")) {
                result.add(String.valueOf(obj.contains(values[i][0])));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        return solve(operations, values).equals(output);
    }

    static class MyHashSet {
        private final Set<Integer> set = new HashSet<>();
        void add(int key) {
            set.add(key);
        }
        void remove(int key) {
            set.remove(key);
        }
        boolean contains(int key) {
            return set.contains(key);
        }
    }
}
