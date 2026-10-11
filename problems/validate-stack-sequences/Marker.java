import java.util.*;
class Marker {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
        Deque<Integer> st = new ArrayDeque<>();
        int j = 0;
        for (int x : pushed) {
            st.push(x);
            while (!st.isEmpty() && j < popped.length && st.peek() == popped[j]) {
                st.pop();
                j++;
            }
        }
        return j == popped.length;
    }
    public boolean isCorrect(int[] pushed, int[] popped, boolean output) {
        return validateStackSequences(pushed, popped) == output;
    }
}
