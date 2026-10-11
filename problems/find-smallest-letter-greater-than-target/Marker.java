import java.util.*;
class Marker {
    public String nextGreatestLetter(String[] letters, String target) {
        char t = target.charAt(0);
        for (String s : letters) {
            if (s.charAt(0) > t) return s;
        }
        return letters[0];
    }
    public boolean isCorrect(String[] letters, String target, String output) {
        return nextGreatestLetter(letters.clone(), target).equals(output);
    }
}
