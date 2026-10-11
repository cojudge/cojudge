import java.util.*;
class Marker {
    public List<String> runCompressedIterator(String compressed, String[] operations) {
        List<Character> chs = new ArrayList<>();
        List<Integer> cnts = new ArrayList<>();
        int i = 0, n = compressed.length();
        while (i < n) {
            char c = compressed.charAt(i++);
            int j = i;
            while (j < n && Character.isDigit(compressed.charAt(j))) j++;
            int cnt = (j > i) ? Integer.parseInt(compressed.substring(i, j)) : 1;
            chs.add(c); cnts.add(cnt);
            i = j;
        }
        List<String> ans = new ArrayList<>();
        int p = 0, rem = chs.isEmpty() ? 0 : cnts.get(0);
        for (String op : operations) {
            if (op.equals("next")) {
                if (p >= chs.size()) ans.add("");
                else {
                    ans.add(String.valueOf(chs.get(p)));
                    rem--;
                    if (rem == 0) { p++; if (p < cnts.size()) rem = cnts.get(p); }
                }
            } else if (op.equals("hasNext")) {
                ans.add(p < chs.size() ? "true" : "false");
            }
        }
        return ans;
    }
    public boolean isCorrect(String compressed, String[] operations, List<String> output) {
        if (output == null) return false;
        return runCompressedIterator(compressed, operations).equals(output);
    }
}
