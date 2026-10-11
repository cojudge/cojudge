import java.util.*;
class Marker {
    public List<List<String>> groupStrings(String[] strings) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strings) {
            map.computeIfAbsent(key(s), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }

    private String key(String s) {
        if (s.length() <= 1) return "*";
        int shift = s.charAt(0) - 'a';
        StringBuilder sb = new StringBuilder();
        for (char c : s.toCharArray()) {
            int v = (c - 'a' - shift + 26) % 26;
            sb.append((char) ('a' + v));
        }
        return sb.toString();
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

    public boolean isCorrect(String[] strings, List<List<String>> output) {
        if (output == null) return false;
        return normalize(groupStrings(strings)).equals(normalize(output));
    }
}
