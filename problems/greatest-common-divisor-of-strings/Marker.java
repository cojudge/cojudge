import java.util.*;
class Marker {
    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    private boolean divides(String divisor, String str) {
        if (str.length() % divisor.length() != 0) return false;
        int repeats = str.length() / divisor.length();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < repeats; i++) sb.append(divisor);
        return sb.toString().equals(str);
    }

    public String gcdOfStrings(String str1, String str2) {
        if (str1.isEmpty() || str2.isEmpty() || !(str1 + str2).equals(str2 + str1)) {
            return "";
        }
        return str1.substring(0, gcd(str1.length(), str2.length()));
    }

    public boolean isCorrect(String str1, String str2, String output) {
        return output != null && gcdOfStrings(str1, str2).equals(output);
    }
}