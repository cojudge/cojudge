import java.util.*;

class Marker {
    public int[] runMinStack(String[] operations, int[] values) {
        if (operations == null || values == null || operations.length != values.length) {
            return new int[0];
        }

        Deque<Integer> stack = new ArrayDeque<>();
        Deque<Integer> minimums = new ArrayDeque<>();
        List<Integer> answers = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String operation = operations[i];
            if (operation.equals("push")) {
                stack.push(values[i]);
                if (minimums.isEmpty() || values[i] <= minimums.peek()) {
                    minimums.push(values[i]);
                }
            } else if (operation.equals("pop")) {
                int removed = stack.pop();
                if (removed == minimums.peek()) minimums.pop();
            } else if (operation.equals("top")) {
                answers.add(stack.peek());
            } else if (operation.equals("getMin")) {
                answers.add(minimums.peek());
            } else {
                throw new IllegalArgumentException("Unknown operation: " + operation);
            }
        }
        return answers.stream().mapToInt(Integer::intValue).toArray();
    }

    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runMinStack(operations, values), output);
    }
}
