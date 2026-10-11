import java.util.*;
class Marker {
    public List<Integer> findSubstring(String s, String[] words) {
        List<Integer> ans = new ArrayList<>();
        if (s == null || words == null || words.length == 0) return ans;
        int wlen = words[0].length();
        int total = wlen * words.length;
        if (s.length() < total) return ans;
        Map<String, Integer> need = new HashMap<>();
        for (String w : words) need.put(w, need.getOrDefault(w, 0) + 1);
        for (int off = 0; off < wlen; off++) {
            Map<String, Integer> win = new HashMap<>();
            int left = off, count = 0;
            for (int j = off; j + wlen <= s.length(); j += wlen) {
                String w = s.substring(j, j + wlen);
                if (!need.containsKey(w)) {
                    win.clear();
                    count = 0;
                    left = j + wlen;
                    continue;
                }
                win.put(w, win.getOrDefault(w, 0) + 1);
                count++;
                while (win.get(w) > need.get(w)) {
                    String lw = s.substring(left, left + wlen);
                    win.put(lw, win.get(lw) - 1);
                    count--;
                    left += wlen;
                }
                if (count == words.length) {
                    ans.add(left);
                    String lw = s.substring(left, left + wlen);
                    win.put(lw, win.get(lw) - 1);
                    count--;
                    left += wlen;
                }
            }
        }
        return ans;
    }
    public boolean isCorrect(String s, String[] words, List<Integer> output) {
        if (output == null) return false;
        List<Integer> exp = new ArrayList<>(findSubstring(s, words));
        List<Integer> act = new ArrayList<>(output);
        Collections.sort(exp);
        Collections.sort(act);
        return exp.equals(act);
    }
}
