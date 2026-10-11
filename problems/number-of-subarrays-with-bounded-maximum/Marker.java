class Marker {
    public int numSubarrayBoundedMax(int[] nums, int left, int right) {
        return countCapped(nums, right) - countCapped(nums, left - 1);
    }
    private int countCapped(int[] nums, int cap) {
        int ans = 0, cur = 0;
        for (int v : nums) {
            if (v <= cap) { cur++; ans += cur; }
            else cur = 0;
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int left, int right, int output) {
        return numSubarrayBoundedMax(nums, left, right) == output;
    }
}
