import java.util.*;

class Marker {
    public int[] runHashSet(String[] operations, int[] values) {
        if (operations == null || values == null || operations.length != values.length) {
            return new int[0];
        }
        Set<Integer> set = new HashSet<>();
        List<Integer> answers = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("MyHashSet")) {
                set.clear();
            } else if (op.equals("add")) {
                set.add(values[i]);
            } else if (op.equals("remove")) {
                set.remove(values[i]);
            } else if (op.equals("contains")) {
                answers.add(set.contains(values[i]) ? 1 : 0);
            } else {
                throw new IllegalArgumentException("Unknown operation: " + op);
            }
        }
        return answers.stream().mapToInt(Integer::intValue).toArray();
    }

    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runHashSet(operations, values), output);
    }
}
