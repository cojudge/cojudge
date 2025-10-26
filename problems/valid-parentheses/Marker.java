import java.util.*;
class Marker {
    public boolean isValid(String s) {
        Map<Character, Character> pairs = new HashMap<>();
        pairs.put(')', '(');
        pairs.put(']', '[');
        pairs.put('}', '{');
        Deque<Character> st = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (pairs.containsValue(c)) st.push(c);
            else if (pairs.containsKey(c)) {
                if (st.isEmpty() || st.pop() != pairs.get(c)) return false;
            }
        }
        return st.isEmpty();
    }
    public boolean isCorrect(String s, boolean output) {
        return output == isValid(s);
    }
}
