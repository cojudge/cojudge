import java.util.*;
class Marker {
    public boolean verifyPreorder(int[] preorder) {
        Deque<Integer> stack = new ArrayDeque<>();
        int low = Integer.MIN_VALUE;
        for (int v : preorder) {
            if (v <= low) return false;
            while (!stack.isEmpty() && v > stack.peek()) {
                low = stack.pop();
            }
            stack.push(v);
        }
        return true;
    }
    public boolean isCorrect(int[] preorder, boolean output) {
        return verifyPreorder(preorder.clone()) == output;
    }
}
