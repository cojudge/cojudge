class Marker {
    // Binary search in rotated sorted array without duplicates
    public int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            // left half sorted
            if (l <= m && nums[l] <= nums[m]) {
                if (nums[l] <= target && target < nums[m]) r = m - 1;
                else l = m + 1;
            } else { // right half sorted
                if (nums[m] < target && target <= nums[r]) l = m + 1;
                else r = m - 1;
            }
        }
        return -1;
    }
    public boolean isCorrect(int[] nums, int target, int output) {
        return search(nums, target) == output;
    }
}
