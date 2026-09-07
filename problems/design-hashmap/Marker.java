import java.util.*;

class Marker {
    public int[] runHashMap(String[] operations, int[][] args) {
        if (operations == null || args == null || operations.length != args.length) {
            return new int[0];
        }
        Map<Integer, Integer> map = new HashMap<>();
        List<Integer> answers = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("MyHashMap")) {
                map.clear();
            } else if (op.equals("put")) {
                map.put(args[i][0], args[i][1]);
            } else if (op.equals("get")) {
                answers.add(map.getOrDefault(args[i][0], -1));
            } else if (op.equals("remove")) {
                map.remove(args[i][0]);
            } else {
                throw new IllegalArgumentException("Unknown operation: " + op);
            }
        }
        return answers.stream().mapToInt(Integer::intValue).toArray();
    }

    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return output != null && Arrays.equals(runHashMap(operations, args), output);
    }
}
