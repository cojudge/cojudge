import java.util.*;
class Marker {
    public int maxChunksToSorted(int[] arr) {
        Deque<Integer> st = new ArrayDeque<>();
        for (int x : arr) {
            int cur = x;
            while (!st.isEmpty() && st.peek() > x) {
                cur = Math.max(cur, st.pop());
            }
            st.push(cur);
        }
        return st.size();
    }
    public boolean isCorrect(int[] arr, int output) {
        return output == maxChunksToSorted(arr);
    }
}
