import java.util.*;
class Marker {
    public int romanToInt(String s) {
        Map<Character, Integer> values = new HashMap<>();
        values.put('I', 1);
        values.put('V', 5);
        values.put('X', 10);
        values.put('L', 50);
        values.put('C', 100);
        values.put('D', 500);
        values.put('M', 1000);
        int total = 0;
        for (int i = 0; i < s.length(); i++) {
            int cur = values.get(s.charAt(i));
            int next = (i + 1 < s.length()) ? values.get(s.charAt(i + 1)) : 0;
            total += (cur < next) ? -cur : cur;
        }
        return total;
    }
    public boolean isCorrect(String s, int output) {
        return romanToInt(s) == output;
    }
}