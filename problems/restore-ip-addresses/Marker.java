import java.util.*;
class Marker {
    public List<String> restoreIpAddresses(String s) {
        List<String> res = new ArrayList<>();
        backtrack(s, 0, 0, new String[4], res);
        return res;
    }
    private void backtrack(String s, int idx, int part, String[] cur, List<String> res) {
        if (part == 4) {
            if (idx == s.length()) {
                res.add(String.join(".", cur));
            }
            return;
        }
        int remaining = s.length() - idx;
        int partsLeft = 4 - part;
        if (remaining < partsLeft || remaining > partsLeft * 3) return;
        for (int len = 1; len <= 3 && idx + len <= s.length(); len++) {
            String piece = s.substring(idx, idx + len);
            if (piece.length() > 1 && piece.charAt(0) == '0') break;
            if (Integer.parseInt(piece) > 255) break;
            cur[part] = piece;
            backtrack(s, idx + len, part + 1, cur, res);
        }
    }
    public boolean isCorrect(String s, List<String> output) {
        if (output == null) return false;
        List<String> exp = new ArrayList<>(restoreIpAddresses(s));
        List<String> act = new ArrayList<>(output);
        Collections.sort(exp);
        Collections.sort(act);
        return exp.equals(act);
    }
}
