import java.util.*;
class Marker {
    private String s; private int pos;
    public int[] flattenNestedList(String nestedList) {
        s = nestedList; pos = 0;
        List<Integer> out = new ArrayList<>();
        parseValue(out);
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    private void parseValue(List<Integer> out) {
        if (pos >= s.length()) return;
        char c = s.charAt(pos);
        if (c == '[') {
            pos++; // '['
            while (pos < s.length() && s.charAt(pos) != ']') {
                if (s.charAt(pos) == ',') { pos++; continue; }
                parseValue(out);
            }
            pos++; // ']'
        } else {
            int sign = 1;
            if (c == '-') { sign = -1; pos++; }
            int num = 0;
            while (pos < s.length() && Character.isDigit(s.charAt(pos))) {
                num = num * 10 + (s.charAt(pos) - '0');
                pos++;
            }
            out.add(sign * num);
        }
    }
    public boolean isCorrect(String nestedList, int[] output) {
        return output != null && Arrays.equals(flattenNestedList(nestedList), output);
    }
}
