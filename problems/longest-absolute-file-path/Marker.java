import java.util.*;
class Marker {
    public int lengthLongestPath(String input) {
        // Runner-safe encoding: '|' stands for newline (avoids raw newlines in
        // generated string literals for some languages). Accept both.
        String norm = input.replace('|', '\n');
        String[] parts = norm.split("\n", -1);
        int[] acc = new int[parts.length + 2];
        int best = 0;
        for (String p : parts) {
            int depth = 0;
            while (depth < p.length() && p.charAt(depth) == '\t') depth++;
            String name = p.substring(depth);
            if (name.contains(".")) {
                int cand = acc[depth] + name.length();
                if (cand > best) best = cand;
            } else {
                acc[depth + 1] = acc[depth] + name.length() + 1;
            }
        }
        return best;
    }
    public boolean isCorrect(String input, int output) {
        return output == lengthLongestPath(input);
    }
}
