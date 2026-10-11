import java.util.*;
class Marker {
    private boolean goodTag(String t) {
        if (t.length() < 1 || t.length() > 9) return false;
        for (int i = 0; i < t.length(); i++) {
            char c = t.charAt(i);
            if (c < 'A' || c > 'Z') return false;
        }
        return true;
    }
    public boolean isValid(String code) {
        int n = code.length();
        if (n == 0) return false;
        Deque<String> st = new ArrayDeque<>();
        int i = 0;
        while (i < n) {
            if (code.startsWith("<![CDATA[", i)) {
                int j = code.indexOf("]]>", i + 9);
                if (j < 0) return false;
                if (st.isEmpty()) return false;
                i = j + 3;
            } else if (code.startsWith("</", i)) {
                int j = code.indexOf('>', i);
                if (j < 0) return false;
                String tag = code.substring(i + 2, j);
                if (!goodTag(tag)) return false;
                if (st.isEmpty() || !st.pop().equals(tag)) return false;
                i = j + 1;
                if (st.isEmpty() && i != n) return false;
            } else if (code.charAt(i) == '<') {
                int j = code.indexOf('>', i);
                if (j < 0) return false;
                String tag = code.substring(i + 1, j);
                if (!goodTag(tag)) return false;
                st.push(tag);
                i = j + 1;
            } else {
                if (st.isEmpty()) return false;
                i++;
            }
        }
        return st.isEmpty();
    }
    public boolean isCorrect(String code, boolean output) {
        return isValid(code) == output;
    }
}
