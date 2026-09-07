import java.util.*;

class Marker {
    public int[] runFreqStack(String[] operations, int[] values) {
        if (operations == null || values == null || operations.length != values.length) {
            return new int[0];
        }
        Map<Integer, Integer> freq = new HashMap<>();
        Map<Integer, Deque<Integer>> groups = new HashMap<>();
        int maxFreq = 0;
        List<Integer> answers = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            if (operations[i].equals("push")) {
                int v = values[i];
                int f = freq.getOrDefault(v, 0) + 1;
                freq.put(v, f);
                maxFreq = Math.max(maxFreq, f);
                groups.computeIfAbsent(f, k -> new ArrayDeque<>()).push(v);
            } else if (operations[i].equals("pop")) {
                Deque<Integer> g = groups.get(maxFreq);
                int v = g.pop();
                freq.put(v, freq.get(v) - 1);
                answers.add(v);
                if (g.isEmpty()) maxFreq--;
            } else {
                throw new IllegalArgumentException("Unknown operation: " + operations[i]);
            }
        }
        return answers.stream().mapToInt(Integer::intValue).toArray();
    }

    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runFreqStack(operations, values), output);
    }
}
