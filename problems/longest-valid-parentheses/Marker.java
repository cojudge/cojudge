import java.util.*;
class Marker {
    public int longestValidParentheses(String s) {
        int max = 0;
        Deque<Integer> st = new ArrayDeque<>();
        st.push(-1);
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                st.push(i);
            } else {
                st.pop();
                if (st.isEmpty()) st.push(i);
                else max = Math.max(max, i - st.peek());
            }
        }
        return max;
    }
    public boolean isCorrect(String s, int output) {
        return longestValidParentheses(s) == output;
    }
}
