import java.util.*;
class Marker {
    public boolean pyramidTransition(String bottom, String[] allowed) {
        Map<String, List<Character>> map = new HashMap<>();
        for (String s : allowed) {
            String key = s.substring(0, 2);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s.charAt(2));
        }
        Set<String> failed = new HashSet<>();
        return dfs(bottom, map, failed);
    }
    private boolean dfs(String row, Map<String, List<Character>> map, Set<String> failed) {
        if (row.length() == 1) return true;
        if (failed.contains(row)) return false;
        List<String> nexts = new ArrayList<>();
        nexts.add("");
        for (int i = 0; i + 1 < row.length(); i++) {
            String key = row.substring(i, i + 2);
            List<Character> tops = map.get(key);
            if (tops == null) { failed.add(row); return false; }
            List<String> tmp = new ArrayList<>();
            for (String r : nexts) for (char c : tops) tmp.add(r + c);
            nexts = tmp;
        }
        for (String nx : nexts) {
            if (dfs(nx, map, failed)) return true;
        }
        failed.add(row);
        return false;
    }
    public boolean isCorrect(String bottom, String[] allowed, boolean output) {
        return pyramidTransition(bottom, allowed.clone()) == output;
    }
}
