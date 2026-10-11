import java.util.*;
class Marker {
    public int sumSubseqWidths(int[] nums) {
        int n = nums.length;
        int MOD = 1000000007;
        int[] a = nums.clone();
        Arrays.sort(a);
        long[] pow = new long[n];
        pow[0] = 1;
        for (int i = 1; i < n; i++) pow[i] = (pow[i - 1] * 2) % MOD;
        long ans = 0;
        for (int i = 0; i < n; i++) {
            long contrib = (pow[i] - pow[n - 1 - i]) % MOD;
            ans = (ans + (long) a[i] * contrib) % MOD;
        }
        ans %= MOD;
        if (ans < 0) ans += MOD;
        return (int) ans;
    }
    public boolean isCorrect(int[] nums, int output) {
        return sumSubseqWidths(nums.clone()) == output;
    }
}
