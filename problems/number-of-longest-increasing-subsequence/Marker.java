import java.util.*;
class Marker {
    public int findNumberOfLIS(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        int[] len = new int[n];
        int[] cnt = new int[n];
        Arrays.fill(len, 1);
        Arrays.fill(cnt, 1);
        int best = 1;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    if (len[j] + 1 > len[i]) {
                        len[i] = len[j] + 1;
                        cnt[i] = cnt[j];
                    } else if (len[j] + 1 == len[i]) {
                        cnt[i] += cnt[j];
                    }
                }
            }
            best = Math.max(best, len[i]);
        }
        int ans = 0;
        for (int i = 0; i < n; i++) if (len[i] == best) ans += cnt[i];
        return ans;
    }
    public boolean isCorrect(int[] nums, int output) {
        return findNumberOfLIS(nums) == output;
    }
}
