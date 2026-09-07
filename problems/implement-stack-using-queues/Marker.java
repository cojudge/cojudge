import java.util.*;

class Marker {
    public int[] runStackUsingQueues(String[] operations, int[] values) {
        if (operations == null || values == null || operations.length != values.length) {
            return new int[0];
        }
        Queue<Integer> q1 = new ArrayDeque<>();
        Queue<Integer> q2 = new ArrayDeque<>();
        List<Integer> answers = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("push")) {
                q2.offer(values[i]);
                while (!q1.isEmpty()) q2.offer(q1.poll());
                Queue<Integer> tmp = q1;
                q1 = q2;
                q2 = tmp;
            } else if (op.equals("pop")) {
                answers.add(q1.poll());
            } else if (op.equals("top")) {
                answers.add(q1.peek());
            } else if (op.equals("empty")) {
                answers.add(q1.isEmpty() ? 1 : 0);
            } else {
                throw new IllegalArgumentException("Unknown operation: " + op);
            }
        }
        return answers.stream().mapToInt(Integer::intValue).toArray();
    }

    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runStackUsingQueues(operations, values), output);
    }
}
