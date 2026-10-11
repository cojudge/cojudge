class Marker {
    public int findPeakElement(int[] nums) {
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < nums[mid + 1]) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
    private boolean isPeak(int[] nums, int idx) {
        if (idx < 0 || idx >= nums.length) return false;
        boolean leftOk = (idx == 0) || (nums[idx] > nums[idx - 1]);
        boolean rightOk = (idx == nums.length - 1) || (nums[idx] > nums[idx + 1]);
        return leftOk && rightOk;
    }
    public boolean isCorrect(int[] nums, int output) {
        return isPeak(nums, output);
    }
}
