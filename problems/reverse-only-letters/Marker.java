import java.util.*;
class Marker {
    private boolean isLetter(char c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    }
    public String reverseOnlyLetters(String s) {
        char[] a = s.toCharArray();
        int i = 0, j = a.length - 1;
        while (i < j) {
            if (!isLetter(a[i])) i++;
            else if (!isLetter(a[j])) j--;
            else {
                char t = a[i];
                a[i] = a[j];
                a[j] = t;
                i++;
                j--;
            }
        }
        return new String(a);
    }
    public boolean isCorrect(String s, String output) {
        return reverseOnlyLetters(s).equals(output);
    }
}
