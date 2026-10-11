import java.util.*;
class Marker {
    public int[] runCircularDeque(String[] operations, int[] values) {
        int k = values[0];
        int[] buf = new int[k];
        int head = 0, count = 0;
        List<Integer> ans = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            String op = operations[i];
            int v = values[i];
            if (op.equals("insertFront")) {
                if (count == k) ans.add(0);
                else { head = (head - 1 + k) % k; buf[head] = v; count++; ans.add(1); }
            } else if (op.equals("insertLast")) {
                if (count == k) ans.add(0);
                else { buf[(head + count) % k] = v; count++; ans.add(1); }
            } else if (op.equals("deleteFront")) {
                if (count == 0) ans.add(0);
                else { head = (head + 1) % k; count--; ans.add(1); }
            } else if (op.equals("deleteLast")) {
                if (count == 0) ans.add(0);
                else { count--; ans.add(1); }
            } else if (op.equals("getFront")) {
                ans.add(count == 0 ? -1 : buf[head]);
            } else if (op.equals("getRear")) {
                ans.add(count == 0 ? -1 : buf[(head + count - 1) % k]);
            } else if (op.equals("isEmpty")) {
                ans.add(count == 0 ? 1 : 0);
            } else if (op.equals("isFull")) {
                ans.add(count == k ? 1 : 0);
            } else {
                throw new IllegalArgumentException("Unknown operation: " + op);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runCircularDeque(operations, values), output);
    }
}
