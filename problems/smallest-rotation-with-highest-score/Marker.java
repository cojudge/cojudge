class Marker {
    public int bestRotation(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        int[] diff = new int[n + 1];
        for (int j = 0; j < n; j++) {
            int v = nums[j];
            int start = (j + 1) % n;
            int end = ((j - v) % n + n) % n;
            if (start <= end) {
                diff[start]++;
                diff[end + 1]--;
            } else {
                diff[start]++;
                diff[n]--;
                diff[0]++;
                diff[end + 1]--;
            }
        }
        int best = 0, mx = -1, cur = 0;
        for (int k = 0; k < n; k++) {
            cur += diff[k];
            if (cur > mx) { mx = cur; best = k; }
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return bestRotation(nums) == output;
    }
}
