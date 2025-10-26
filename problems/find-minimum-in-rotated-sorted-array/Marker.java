class Marker {
    // Binary search on rotation pivot
    public int findMin(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int l = 0, r = nums.length - 1;
        while (l < r) {
            if (nums[l] < nums[r]) return nums[l]; // already sorted
            int m = l + (r - l) / 2;
            if (nums[m] >= nums[l]) {
                l = m + 1;
            } else {
                r = m;
            }
        }
        return nums[l];
    }
    public boolean isCorrect(int[] nums, int output) {
        return findMin(nums) == output;
    }
}
