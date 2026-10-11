import java.util.*;
class Marker {
    public String mostCommonWord(String paragraph, String[] banned) {
        Set<String> ban = new HashSet<>();
        for (String b : banned) ban.add(b.toLowerCase());
        Map<String, Integer> cnt = new HashMap<>();
        Map<String, Integer> first = new HashMap<>();
        StringBuilder cur = new StringBuilder();
        int order = 0;
        String low = paragraph.toLowerCase();
        for (int i = 0; i <= low.length(); i++) {
            char c = i < low.length() ? low.charAt(i) : ' ';
            if (c >= 'a' && c <= 'z') cur.append(c);
            else if (cur.length() > 0) {
                String w = cur.toString();
                cur.setLength(0);
                if (!ban.contains(w)) {
                    cnt.put(w, cnt.getOrDefault(w, 0) + 1);
                    first.putIfAbsent(w, order++);
                }
            }
        }
        String best = "";
        int bestC = -1, bestO = Integer.MAX_VALUE;
        for (Map.Entry<String, Integer> e : cnt.entrySet()) {
            int cc = e.getValue(), oo = first.get(e.getKey());
            if (cc > bestC || (cc == bestC && oo < bestO)) { bestC = cc; bestO = oo; best = e.getKey(); }
        }
        return best;
    }
    public boolean isCorrect(String paragraph, String[] banned, String output) {
        return mostCommonWord(paragraph, banned).equals(output);
    }
}
