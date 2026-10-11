import java.util.*;
class Marker {
    public int scoreOfParentheses(String s) {
        Deque<Integer> st = new ArrayDeque<>();
        st.push(0);
        for (char c : s.toCharArray()) {
            if (c == '(') st.push(0);
            else {
                int v = st.pop();
                int add = Math.max(2 * v, 1);
                st.push(st.pop() + add);
            }
        }
        return st.pop();
    }
    public boolean isCorrect(String s, int output) {
        return scoreOfParentheses(s) == output;
    }
}
