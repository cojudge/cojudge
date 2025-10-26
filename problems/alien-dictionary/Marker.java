import java.util.*;
class Marker {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> g = new HashMap<>();
        int[] indeg = new int[26];
        Arrays.fill(indeg, -1); // -1 means not present
        for (String w : words) for (char ch : w.toCharArray()) if (indeg[ch-'a'] == -1) { indeg[ch-'a'] = 0; g.put(ch, new HashSet<>()); }
        for (int i = 0; i < words.length - 1; i++) {
            String a = words[i], b = words[i+1];
            int len = Math.min(a.length(), b.length());
            int j = 0;
            while (j < len && a.charAt(j) == b.charAt(j)) j++;
            if (j == len) {
                if (a.length() > b.length()) return ""; // invalid prefix
                continue;
            }
            char u = a.charAt(j), v = b.charAt(j);
            if (!g.get(u).contains(v)) {
                g.get(u).add(v);
                indeg[v-'a']++;
            }
        }
        Deque<Character> dq = new ArrayDeque<>();
        for (int i = 0; i < 26; i++) if (indeg[i] == 0) dq.add((char)('a'+i));
        StringBuilder sb = new StringBuilder();
        while (!dq.isEmpty()) {
            char u = dq.poll();
            sb.append(u);
            for (char v : g.getOrDefault(u, Collections.emptySet())) {
                indeg[v-'a']--;
                if (indeg[v-'a'] == 0) dq.add(v);
            }
        }
        // validate that all present chars were output
        int present = 0;
        for (int i = 0; i < 26; i++) if (indeg[i] != -1) present++;
        if (sb.length() != present) return ""; // cycle exists
        return sb.toString();
    }

    public boolean isCorrect(String[] words, String output) {
        // Validate that output is a valid topological order for the constraints derived from words
        // Build precedence constraints
        Map<Character, Set<Character>> edges = new HashMap<>();
        Set<Character> chars = new HashSet<>();
        for (String w : words) for (char ch : w.toCharArray()) chars.add(ch);
        for (int i = 0; i < words.length - 1; i++) {
            String a = words[i], b = words[i+1];
            int len = Math.min(a.length(), b.length());
            int j = 0;
            while (j < len && a.charAt(j) == b.charAt(j)) j++;
            if (j == len) {
                if (a.length() > b.length()) {
                    // invalid prefix -> only empty output acceptable
                    return output.isEmpty();
                }
                continue;
            }
            char u = a.charAt(j), v = b.charAt(j);
            edges.computeIfAbsent(u, k -> new HashSet<>()).add(v);
        }
        // If output empty, check for cycle by trying to compute some order
        if (output.isEmpty()) {
            String any = alienOrder(words);
            return any.isEmpty();
        }
        // 1) All characters present exactly once
        if (output.length() != chars.size()) return false;
        Set<Character> seen = new HashSet<>();
        for (char ch : output.toCharArray()) {
            if (!chars.contains(ch) || !seen.add(ch)) return false;
        }
        // 2) All precedence constraints respected
        Map<Character, Integer> pos = new HashMap<>();
        for (int i = 0; i < output.length(); i++) pos.put(output.charAt(i), i);
        for (Map.Entry<Character, Set<Character>> e : edges.entrySet()) {
            char u = e.getKey();
            for (char v : e.getValue()) {
                if (pos.get(u) >= pos.get(v)) return false;
            }
        }
        return true;
    }
}
