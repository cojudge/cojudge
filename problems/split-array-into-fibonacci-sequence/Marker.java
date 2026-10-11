import java.util.*;
class Marker {
    public List<Integer> splitIntoFibonacci(String num) {
        List<Integer> res = new ArrayList<>();
        if (dfs(num, 0, res)) return res;
        return new ArrayList<>();
    }
    private boolean dfs(String s, int pos, List<Integer> cur) {
        if (pos == s.length()) return cur.size() >= 3;
        for (int len = 1; len <= 10 && pos + len <= s.length(); len++) {
            if (len > 1 && s.charAt(pos) == '0') break;
            long v;
            try { v = Long.parseLong(s.substring(pos, pos + len)); } catch (Exception e) { break; }
            if (v > Integer.MAX_VALUE) break;
            int sz = cur.size();
            if (sz >= 2) {
                long want = (long) cur.get(sz - 1) + (long) cur.get(sz - 2);
                if (v < want) continue;
                if (v > want) break;
            }
            cur.add((int) v);
            if (dfs(s, pos + len, cur)) return true;
            cur.remove(cur.size() - 1);
            if (sz >= 2) break;
        }
        return false;
    }
    public boolean isCorrect(String num, List<Integer> output) {
        if (output == null) return false;
        List<Integer> ref = splitIntoFibonacci(num);
        if (output.isEmpty()) return ref.isEmpty();
        if (output.size() < 3) return false;
        for (int v : output) {
            if ((long) v > Integer.MAX_VALUE) return false;
        }
        for (int i = 2; i < output.size(); i++) {
            if ((long) output.get(i - 1) + (long) output.get(i - 2) != (long) output.get(i)) return false;
        }
        StringBuilder sb = new StringBuilder();
        for (int v : output) {
            String t = String.valueOf(v);
            // leading zero check is implicit: value rendering has none; verify pieces match num
            sb.append(t);
        }
        if (!sb.toString().equals(num)) return false;
        // verify no piece had a leading zero in the original split: rebuild greedily
        int p = 0;
        for (int v : output) {
            String t = String.valueOf(v);
            if (num.charAt(p) == '0' && t.length() > 1) return false;
            if (!num.startsWith(t, p)) return false;
            p += t.length();
        }
        return p == num.length();
    }
}
