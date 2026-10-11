import java.util.*;
class Marker {
    public List<List<String>> findDuplicate(String[] paths) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String entry : paths) {
            String[] parts = entry.split(" ");
            String dir = parts[0];
            for (int i = 1; i < parts.length; i++) {
                String token = parts[i];
                int lp = token.indexOf('(');
                String name = token.substring(0, lp);
                String content = token.substring(lp + 1, token.length() - 1);
                String full = dir + "/" + name;
                groups.computeIfAbsent(content, k -> new ArrayList<>()).add(full);
            }
        }
        List<List<String>> res = new ArrayList<>();
        for (List<String> g : groups.values()) {
            if (g.size() >= 2) res.add(new ArrayList<>(g));
        }
        return res;
    }
    private List<List<String>> normalize(List<List<String>> groups) {
        List<List<String>> res = new ArrayList<>();
        for (List<String> g : groups) {
            List<String> copy = new ArrayList<>(g);
            Collections.sort(copy);
            res.add(copy);
        }
        res.sort(Comparator.comparing((List<String> l) -> l.isEmpty() ? "" : l.get(0)).thenComparingInt(List::size));
        return res;
    }
    public boolean isCorrect(String[] paths, List<List<String>> output) {
        return normalize(findDuplicate(paths)).equals(normalize(output));
    }
}
