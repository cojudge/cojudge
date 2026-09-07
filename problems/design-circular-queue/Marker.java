import java.util.*;

class Marker {
    public int[] runCircularQueue(String[] operations, int[] values) {
        if (operations == null || values == null || operations.length != values.length || operations.length == 0) {
            return new int[0];
        }
        int k = values[0];
        int[] buf = new int[k];
        int head = 0, count = 0;
        List<Integer> answers = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("enQueue")) {
                if (count == k) {
                    answers.add(0);
                } else {
                    buf[(head + count) % k] = values[i];
                    count++;
                    answers.add(1);
                }
            } else if (op.equals("deQueue")) {
                if (count == 0) {
                    answers.add(0);
                } else {
                    head = (head + 1) % k;
                    count--;
                    answers.add(1);
                }
            } else if (op.equals("Front")) {
                answers.add(count == 0 ? -1 : buf[head]);
            } else if (op.equals("Rear")) {
                answers.add(count == 0 ? -1 : buf[(head + count - 1) % k]);
            } else if (op.equals("isEmpty")) {
                answers.add(count == 0 ? 1 : 0);
            } else if (op.equals("isFull")) {
                answers.add(count == k ? 1 : 0);
            } else {
                throw new IllegalArgumentException("Unknown operation: " + op);
            }
        }
        return answers.stream().mapToInt(Integer::intValue).toArray();
    }

    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runCircularQueue(operations, values), output);
    }
}
