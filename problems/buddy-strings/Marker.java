import java.util.*;
class Marker {
    public boolean buddyStrings(String s, String goal) {
        if (s.length() != goal.length()) return false;
        if (s.equals(goal)) {
            Set<Character> seen = new HashSet<>();
            for (char c : s.toCharArray()) {
                if (!seen.add(c)) return true;
            }
            return false;
        }
        List<Integer> diff = new ArrayList<>();
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) != goal.charAt(i)) diff.add(i);
            if (diff.size() > 2) return false;
        }
        return diff.size() == 2 && s.charAt(diff.get(0)) == goal.charAt(diff.get(1)) && s.charAt(diff.get(1)) == goal.charAt(diff.get(0));
    }
    public boolean isCorrect(String s, String goal, boolean output) {
        return buddyStrings(s, goal) == output;
    }
}
