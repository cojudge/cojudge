import java.util.*;
class Marker {
    public boolean isStrobogrammatic(String num) {
        Map<Character, Character> rot = new HashMap<>();
        rot.put('0', '0');
        rot.put('1', '1');
        rot.put('6', '9');
        rot.put('8', '8');
        rot.put('9', '6');
        int i = 0, j = num.length() - 1;
        while (i <= j) {
            char a = num.charAt(i), b = num.charAt(j);
            if (!rot.containsKey(a) || rot.get(a) != b) return false;
            i++;
            j--;
        }
        return true;
    }

    public boolean isCorrect(String num, boolean output) {
        return output == isStrobogrammatic(num);
    }
}
