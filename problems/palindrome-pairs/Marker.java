import java.util.*;
class Marker {
    public List<List<Integer>> palindromePairs(String[] words) {
        Map<String, Integer> index = new HashMap<>();
        for (int i = 0; i < words.length; i++) index.put(words[i], i);
        List<List<Integer>> res = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            int n = w.length();
            for (int cut = 0; cut <= n; cut++) {
                String left = w.substring(0, cut);
                String right = w.substring(cut);
                if (isPal(left)) {
                    String need = new StringBuilder(right).reverse().toString();
                    Integer j = index.get(need);
                    if (j != null && j != i) {
                        String key = j + "," + i;
                        if (seen.add(key)) res.add(Arrays.asList(j, i));
                    }
                }
                if (right.length() > 0 && isPal(right)) {
                    String need = new StringBuilder(left).reverse().toString();
                    Integer j = index.get(need);
                    if (j != null && j != i) {
                        String key = i + "," + j;
                        if (seen.add(key)) res.add(Arrays.asList(i, j));
                    }
                }
            }
        }
        return res;
    }
    private boolean isPal(String s) {
        int a = 0, b = s.length() - 1;
        while (a < b) {
            if (s.charAt(a) != s.charAt(b)) return false;
            a++; b--;
        }
        return true;
    }
    private List<List<Integer>> canon(List<List<Integer>> rows) {
        List<List<Integer>> r = new ArrayList<>();
        for (List<Integer> row : rows) r.add(new ArrayList<>(row));
        r.sort((x, y) -> {
            int c = Integer.compare(x.get(0), y.get(0));
            if (c != 0) return c;
            return Integer.compare(x.get(1), y.get(1));
        });
        return r;
    }
    public boolean isCorrect(String[] words, List<List<Integer>> output) {
        if (output == null) return false;
        return canon(palindromePairs(words)).equals(canon(output));
    }
}
