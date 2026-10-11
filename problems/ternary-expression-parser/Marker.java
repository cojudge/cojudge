import java.util.*;
class Marker {
    public String parseTernary(String expression) {
        Deque<Character> st = new ArrayDeque<>();
        for (int i = expression.length() - 1; i >= 0; i--) {
            char c = expression.charAt(i);
            if (c == '?') {
                char cond = expression.charAt(i - 1);
                i--;
                char trueVal = st.pop();
                st.pop();
                char falseVal = st.pop();
                st.push(cond == 'T' ? trueVal : falseVal);
            } else if (c == ':') {
                st.push(c);
            } else {
                st.push(c);
            }
        }
        return String.valueOf(st.pop());
    }
    public boolean isCorrect(String expression, String output) {
        return parseTernary(expression).equals(output);
    }
}
