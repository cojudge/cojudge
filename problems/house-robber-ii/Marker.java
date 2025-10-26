class Marker {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
    }
    private int robLinear(int[] a, int l, int r) {
        int rob = 0, skip = 0;
        for (int i = l; i <= r; i++) {
            int newRob = skip + a[i];
            skip = Math.max(skip, rob);
            rob = newRob;
        }
        return Math.max(rob, skip);
    }
    public boolean isCorrect(int[] nums, int output) { return rob(nums) == output; }
}
