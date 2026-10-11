import java.util.*;
class Marker {
    public String frequencySort(String s) {
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : s.toCharArray()) freq.put(c, freq.getOrDefault(c, 0) + 1);
        List<Character> chars = new ArrayList<>(freq.keySet());
        chars.sort((a, b) -> freq.get(b) - freq.get(a));
        StringBuilder sb = new StringBuilder();
        for (char c : chars) for (int i = 0; i < freq.get(c); i++) sb.append(c);
        return sb.toString();
    }
    public boolean isCorrect(String s, String output) {
        if (output == null || output.length() != s.length()) return false;
        Map<Character, Integer> f1 = new HashMap<>();
        Map<Character, Integer> f2 = new HashMap<>();
        for (char c : s.toCharArray()) f1.put(c, f1.getOrDefault(c, 0) + 1);
        for (char c : output.toCharArray()) f2.put(c, f2.getOrDefault(c, 0) + 1);
        if (!f1.equals(f2)) return false;
        for (int i = 1; i < output.length(); i++) {
            if (f1.get(output.charAt(i)) > f1.get(output.charAt(i - 1))) return false;
        }
        return true;
    }
}
