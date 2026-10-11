import java.util.*;
class Marker {
    public String boldWords(String[] words, String s) {
        int n = s.length();
        boolean[] bold = new boolean[n];
        for (String w : words) {
            int from = 0;
            while (true) {
                int idx = s.indexOf(w, from);
                if (idx < 0) break;
                for (int i = idx; i < idx + w.length(); i++) bold[i] = true;
                from = idx + 1;
            }
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            if (bold[i] && (i == 0 || !bold[i - 1])) sb.append("<b>");
            sb.append(s.charAt(i));
            if (bold[i] && (i == n - 1 || !bold[i + 1])) sb.append("</b>");
        }
        return sb.toString();
    }
    public boolean isCorrect(String[] words, String s, String output) {
        return boldWords(words.clone(), s).equals(output);
    }
}
