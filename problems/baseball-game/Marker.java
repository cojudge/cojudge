import java.util.*;

class Marker {
    public int calPoints(String[] operations) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String op : operations) {
            if (op.equals("C")) {
                stack.pop();
            } else if (op.equals("D")) {
                stack.push(2 * stack.peek());
            } else if (op.equals("+")) {
                int top = stack.pop();
                int next = top + stack.peek();
                stack.push(top);
                stack.push(next);
            } else {
                stack.push(Integer.parseInt(op));
            }
        }
        int sum = 0;
        for (int v : stack) sum += v;
        return sum;
    }

    public boolean isCorrect(String[] operations, int output) {
        return calPoints(operations) == output;
    }
}
