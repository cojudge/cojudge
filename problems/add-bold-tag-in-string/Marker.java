import java.util.*;
class Marker {
    public String addBoldTag(String s, String[] dict) {
        int n = s.length();
        boolean[] bold = new boolean[n];
        for (String w : dict) {
            if (w == null || w.length() == 0) continue;
            int from = 0;
            while (true) {
                int idx = s.indexOf(w, from);
                if (idx < 0) break;
                for (int k = idx; k < idx + w.length(); k++) bold[k] = true;
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
    public boolean isCorrect(String s, String[] dict, String output) {
        return addBoldTag(s, dict.clone()).equals(output);
    }
}
