import java.util.*;
class Marker {
    public List<String> removeComments(String[] source) {
        List<String> ans = new ArrayList<>();
        StringBuilder buf = new StringBuilder();
        boolean inBlock = false;
        for (String line : source) {
            int i = 0;
            int n = line.length();
            while (i < n) {
                if (!inBlock && i + 1 < n && line.charAt(i) == '/' && line.charAt(i+1) == '/') {
                    break;
                } else if (!inBlock && i + 1 < n && line.charAt(i) == '/' && line.charAt(i+1) == '*') {
                    inBlock = true;
                    i += 2;
                } else if (inBlock && i + 1 < n && line.charAt(i) == '*' && line.charAt(i+1) == '/') {
                    inBlock = false;
                    i += 2;
                } else if (inBlock) {
                    i++;
                } else {
                    buf.append(line.charAt(i));
                    i++;
                }
            }
            if (!inBlock && buf.length() > 0) {
                ans.add(buf.toString());
                buf.setLength(0);
            }
        }
        return ans;
    }
    public boolean isCorrect(String[] source, List<String> output) {
        if (output == null) return false;
        List<String> exp = removeComments(source);
        if (exp.size() != output.size()) return false;
        for (int i = 0; i < exp.size(); i++) {
            String a = exp.get(i);
            String b = output.get(i);
            if (a == null || b == null) {
                if (a != b) return false;
                continue;
            }
            // Tolerate runner trimming (javaUtil to_string_list does .trim()):
            // accept exact match or trimmed match so non-Java runners
            // (which round-trip via display+parse) still validate.
            if (!a.equals(b) && !a.trim().equals(b.trim())) return false;
        }
        return true;
    }
}
