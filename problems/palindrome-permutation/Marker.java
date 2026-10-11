import java.util.*;
class Marker {
    public boolean canPermutePalindrome(String s) {
        Set<Character> odd = new HashSet<>();
        for (char c : s.toCharArray()) {
            if (!odd.add(c)) odd.remove(c);
        }
        return odd.size() <= 1;
    }
    public boolean isCorrect(String s, boolean output) {
        return canPermutePalindrome(s) == output;
    }
}
