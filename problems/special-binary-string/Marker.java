import java.util.*;
class Marker {
    public String makeLargestSpecial(String s) {
        List<String> parts = new ArrayList<>();
        int bal = 0, start = 0;
        for (int i = 0; i < s.length(); i++) {
            bal += s.charAt(i) == '1' ? 1 : -1;
            if (bal == 0) {
                String inner = s.substring(start + 1, i);
                parts.add("1" + makeLargestSpecial(inner) + "0");
                start = i + 1;
            }
        }
        parts.sort(Collections.reverseOrder());
        StringBuilder sb = new StringBuilder();
        for (String p : parts) sb.append(p);
        return sb.toString();
    }
    public boolean isCorrect(String s, String output) {
        return makeLargestSpecial(s).equals(output);
    }
}
