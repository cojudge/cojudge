import java.util.*;
class Marker {
    public int findLength(int[] nums1, int[] nums2) {
        int m = nums1.length, n = nums2.length;
        int[][] dp = new int[m + 1][n + 1];
        int best = 0;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (nums1[i-1] == nums2[j-1]) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                    best = Math.max(best, dp[i][j]);
                }
            }
        }
        return best;
    }
    public boolean isCorrect(int[] nums1, int[] nums2, int output) {
        return findLength(nums1, nums2) == output;
    }
}
