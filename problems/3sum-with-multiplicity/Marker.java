import java.util.*;
class Marker {
    public int threeSumMulti(int[] arr, int target) {
        long mod = 1000000007L;
        long[] c = new long[101];
        for (int v : arr) c[v]++;
        long ans = 0;
        for (int i = 0; i <= 100; i++) {
            if (c[i] == 0) continue;
            for (int j = i; j <= 100; j++) {
                if (c[j] == 0) continue;
                int k = target - i - j;
                if (k < j || k > 100 || c[k] == 0) continue;
                if (i == j && j == k) ans += c[i] * (c[i] - 1) * (c[i] - 2) / 6;
                else if (i == j) ans += c[i] * (c[i] - 1) / 2 * c[k];
                else if (j == k) ans += c[i] * c[j] * (c[j] - 1) / 2;
                else ans += c[i] * c[j] * c[k];
            }
        }
        return (int) (ans % mod);
    }
    public boolean isCorrect(int[] arr, int target, int output) {
        return threeSumMulti(arr, target) == output;
    }
}
