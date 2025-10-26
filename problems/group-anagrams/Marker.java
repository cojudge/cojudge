import java.util.*;
class Marker {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] a = s.toCharArray();
            Arrays.sort(a);
            String key = new String(a);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
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

    public boolean isCorrect(String[] strs, List<List<String>> output) {
        List<List<String>> expected = groupAnagrams(strs);
        return normalize(expected).equals(normalize(output));
    }
}
