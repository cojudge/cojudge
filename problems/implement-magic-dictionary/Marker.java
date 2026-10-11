import java.util.*;
class Marker {
    public int[] runMagicDictionary(String[] operations, String[] words) {
        List<String> dict = new ArrayList<>();
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("buildDict")) {
                dict.clear();
                String packed = words[i];
                if (packed != null && !packed.isEmpty()) {
                    for (String w : packed.split("\\|", -1)) {
                        if (!w.isEmpty()) dict.add(w);
                    }
                }
            } else if (op.equals("search")) {
                String q = words[i];
                boolean ok = false;
                for (String w : dict) {
                    if (w.length() != q.length()) continue;
                    int diff = 0;
                    for (int k = 0; k < w.length(); k++) {
                        if (w.charAt(k) != q.charAt(k)) {
                            diff++;
                            if (diff > 1) break;
                        }
                    }
                    if (diff == 1) { ok = true; break; }
                }
                ans.add(ok ? 1 : 0);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, String[] words, int[] output) {
        return Arrays.equals(runMagicDictionary(operations, words), output);
    }
}
