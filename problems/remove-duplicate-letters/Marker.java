import java.util.*;
class Marker {
    public String removeDuplicateLetters(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) last[s.charAt(i) - 'a'] = i;
        boolean[] inStack = new boolean[26];
        StringBuilder st = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (inStack[c - 'a']) continue;
            while (st.length() > 0 && st.charAt(st.length() - 1) > c
                    && last[st.charAt(st.length() - 1) - 'a'] > i) {
                inStack[st.charAt(st.length() - 1) - 'a'] = false;
                st.deleteCharAt(st.length() - 1);
            }
            st.append(c);
            inStack[c - 'a'] = true;
        }
        return st.toString();
    }
    public boolean isCorrect(String s, String output) {
        return removeDuplicateLetters(s).equals(output);
    }
}
