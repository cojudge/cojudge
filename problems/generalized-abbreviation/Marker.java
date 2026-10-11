import java.util.*;
class Marker {
    public List<String> generateAbbreviations(String word) {
        List<String> res = new ArrayList<>();
        backtrack(word, 0, 0, new StringBuilder(), res);
        return res;
    }

    private void backtrack(String word, int pos, int count, StringBuilder cur, List<String> res) {
        int len = cur.length();
        if (pos == word.length()) {
            if (count > 0) cur.append(count);
            res.add(cur.toString());
            cur.setLength(len);
            return;
        }
        backtrack(word, pos + 1, count + 1, cur, res);
        if (count > 0) cur.append(count);
        cur.append(word.charAt(pos));
        backtrack(word, pos + 1, 0, cur, res);
        cur.setLength(len);
    }

    public boolean isCorrect(String word, List<String> output) {
        if (output == null) return false;
        List<String> a = new ArrayList<>(generateAbbreviations(word));
        List<String> b = new ArrayList<>(output);
        Collections.sort(a);
        Collections.sort(b);
        return a.equals(b);
    }
}
