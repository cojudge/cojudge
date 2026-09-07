import java.util.*;

class Marker {
    public int[] runQueueUsingStacks(String[] operations, int[] values) {
        if (operations == null || values == null || operations.length != values.length) {
            return new int[0];
        }
        Deque<Integer> in = new ArrayDeque<>();
        Deque<Integer> out = new ArrayDeque<>();
        List<Integer> answers = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("push")) {
                in.push(values[i]);
            } else if (op.equals("pop")) {
                move(in, out);
                answers.add(out.pop());
            } else if (op.equals("peek")) {
                move(in, out);
                answers.add(out.peek());
            } else if (op.equals("empty")) {
                answers.add((in.isEmpty() && out.isEmpty()) ? 1 : 0);
            } else {
                throw new IllegalArgumentException("Unknown operation: " + op);
            }
        }
        return answers.stream().mapToInt(Integer::intValue).toArray();
    }

    private void move(Deque<Integer> in, Deque<Integer> out) {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
    }

    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runQueueUsingStacks(operations, values), output);
    }
}
