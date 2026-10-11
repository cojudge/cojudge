import java.util.*;
class Marker {
    public String getPermutation(int n, int k) {
        List<Integer> digits = new ArrayList<>();
        for (int i = 1; i <= n; i++) digits.add(i);
        int[] fact = new int[n + 1];
        fact[0] = 1;
        for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;
        k--;
        StringBuilder sb = new StringBuilder();
        for (int i = n; i >= 1; i--) {
            int idx = k / fact[i - 1];
            k %= fact[i - 1];
            sb.append(digits.remove(idx));
        }
        return sb.toString();
    }
    public boolean isCorrect(int n, int k, String output) {
        return getPermutation(n, k).equals(output);
    }
}
