import java.util.*;

class Marker {
    public String decodeString(String s) {
        Deque<Integer> counts = new ArrayDeque<>();
        Deque<StringBuilder> strings = new ArrayDeque<>();
        StringBuilder cur = new StringBuilder();
        int k = 0;
        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                k = k * 10 + (c - '0');
            } else if (c == '[') {
                counts.push(k);
                strings.push(cur);
                cur = new StringBuilder();
                k = 0;
            } else if (c == ']') {
                int rep = counts.pop();
                StringBuilder prev = strings.pop();
                for (int i = 0; i < rep; i++) prev.append(cur);
                cur = prev;
            } else {
                cur.append(c);
            }
        }
        return cur.toString();
    }

    public boolean isCorrect(String s, String output) {
        String expected = decodeString(s);
        return expected.equals(output);
    }
}
