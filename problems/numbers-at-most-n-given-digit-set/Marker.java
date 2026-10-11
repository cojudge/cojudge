import java.util.*;
class Marker {
    public int atMostNGivenDigitSet(String[] digits, int n) {
        String s = String.valueOf(n);
        int L = s.length();
        int D = digits.length;
        int ans = 0;
        int pow = 1;
        for (int len = 1; len < L; len++) {
            pow *= D;
            ans += pow;
        }
        for (int i = 0; i < L; i++) {
            boolean hasSame = false;
            for (String d : digits) {
                char c = d.charAt(0);
                if (c < s.charAt(i)) {
                    ans += (int) Math.pow(D, L - 1 - i);
                } else if (c == s.charAt(i)) {
                    hasSame = true;
                }
            }
            if (!hasSame) return ans;
        }
        return ans + 1;
    }
    public boolean isCorrect(String[] digits, int n, int output) {
        return atMostNGivenDigitSet(digits, n) == output;
    }
}
