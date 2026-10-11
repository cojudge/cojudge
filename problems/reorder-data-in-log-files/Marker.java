import java.util.*;
class Marker {
    public List<String> reorderLogFiles(String[] logs) {
        List<String> letter = new ArrayList<>();
        List<String> digit = new ArrayList<>();
        for (String log : logs) {
            int sp = log.indexOf(' ');
            String rest = log.substring(sp + 1);
            char c = rest.charAt(0);
            if (c >= '0' && c <= '9') digit.add(log);
            else letter.add(log);
        }
        letter.sort((a, b) -> {
            int sa = a.indexOf(' ');
            int sb = b.indexOf(' ');
            String ca = a.substring(sa + 1);
            String cb = b.substring(sb + 1);
            int cmp = ca.compareTo(cb);
            if (cmp != 0) return cmp;
            return a.substring(0, sa).compareTo(b.substring(0, sb));
        });
        List<String> ans = new ArrayList<>(letter);
        ans.addAll(digit);
        return ans;
    }
    public boolean isCorrect(String[] logs, List<String> output) {
        if (output == null) return false;
        return reorderLogFiles(logs).equals(output);
    }
}
