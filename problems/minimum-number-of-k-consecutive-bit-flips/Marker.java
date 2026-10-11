class Marker {
    public int minKBitFlips(int[] nums, int k) {
        int n = nums.length;
        int[] started = new int[n];
        int active = 0;
        int ans = 0;
        for (int i = 0; i < n; i++) {
            if (i >= k) {
                active -= started[i - k];
            }
            if ((nums[i] + active) % 2 == 0) {
                if (i + k > n) {
                    return -1;
                }
                started[i] = 1;
                active++;
                ans++;
            }
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int k, int output) {
        return minKBitFlips(nums, k) == output;
    }
}
