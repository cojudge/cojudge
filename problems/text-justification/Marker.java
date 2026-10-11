import java.util.*;
class Marker {
    public List<String> fullJustify(String[] words, int maxWidth) {
        List<String> res = new ArrayList<>();
        int i = 0;
        while (i < words.length) {
            int j = i;
            int lineLen = 0;
            while (j < words.length && lineLen + words[j].length() + (j - i) <= maxWidth) {
                lineLen += words[j].length();
                j++;
            }
            int numWords = j - i;
            boolean isLast = (j == words.length);
            StringBuilder sb = new StringBuilder();
            if (numWords == 1 || isLast) {
                for (int k = i; k < j; k++) {
                    if (k > i) sb.append(' ');
                    sb.append(words[k]);
                }
                while (sb.length() < maxWidth) sb.append(' ');
            } else {
                int totalSpaces = maxWidth - lineLen;
                int gaps = numWords - 1;
                int base = totalSpaces / gaps;
                int extra = totalSpaces % gaps;
                for (int k = i; k < j; k++) {
                    sb.append(words[k]);
                    if (k < j - 1) {
                        int spaces = base + (k - i < extra ? 1 : 0);
                        for (int s = 0; s < spaces; s++) sb.append(' ');
                    }
                }
            }
            res.add(sb.toString());
            i = j;
        }
        return res;
    }
    public boolean isCorrect(String[] words, int maxWidth, List<String> output) {
        List<String> exp = fullJustify(words, maxWidth);
        if (output == null || output.size() != exp.size()) return false;
        for (int i = 0; i < exp.size(); i++) {
            String a = exp.get(i).replaceAll("\\s+$", "");
            String b = output.get(i).replaceAll("\\s+$", "");
            if (!a.equals(b)) return false;
        }
        return true;
    }
}
