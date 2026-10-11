import java.util.*;
class Marker {
    public String removeKdigits(String num, int k) {
        StringBuilder st = new StringBuilder();
        for (int i = 0; i < num.length(); i++) {
            char c = num.charAt(i);
            while (st.length() > 0 && k > 0 && st.charAt(st.length() - 1) > c) {
                st.deleteCharAt(st.length() - 1);
                k--;
            }
            st.append(c);
        }
        while (k > 0 && st.length() > 0) {
            st.deleteCharAt(st.length() - 1);
            k--;
        }
        int p = 0;
        while (p < st.length() && st.charAt(p) == '0') p++;
        String res = st.substring(p);
        return res.isEmpty() ? "0" : res;
    }
    public boolean isCorrect(String num, int k, String output) {
        if (output == null) return false;
        return removeKdigits(num, k).equals(output);
    }
}
