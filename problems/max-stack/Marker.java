import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        MaxStack obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("MaxStack")) {
                obj = new MaxStack();
                result.add("null");
            } else if (op.equals("push")) {
                obj.push(values[i][0]);
                result.add("null");
            } else if (op.equals("pop")) {
                result.add(String.valueOf(obj.pop()));
            } else if (op.equals("top")) {
                result.add(String.valueOf(obj.top()));
            } else if (op.equals("peekMax")) {
                result.add(String.valueOf(obj.peekMax()));
            } else if (op.equals("popMax")) {
                result.add(String.valueOf(obj.popMax()));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        return solve(operations, values).equals(output);
    }

    static class MaxStack {
        private final Deque<Integer> stack = new ArrayDeque<>();
        private final Deque<Integer> maxStack = new ArrayDeque<>();
        void push(int x) {
            stack.push(x);
            if (maxStack.isEmpty() || x >= maxStack.peek()) maxStack.push(x);
            else maxStack.push(maxStack.peek());
        }
        int pop() {
            maxStack.pop();
            return stack.pop();
        }
        int top() {
            return stack.peek();
        }
        int peekMax() {
            return maxStack.peek();
        }
        int popMax() {
            int mx = maxStack.peek();
            Deque<Integer> buf = new ArrayDeque<>();
            while (stack.peek() != mx) {
                buf.push(stack.pop());
                maxStack.pop();
            }
            stack.pop();
            maxStack.pop();
            while (!buf.isEmpty()) push(buf.pop());
            return mx;
        }
    }
}
