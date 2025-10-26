class Marker {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int x = n;
        for (int i = 0; i < n; i++) {
            x ^= i;
            x ^= nums[i];
        }
        return x;
    }

    public boolean isCorrect(int[] nums, int output) {
        return missingNumber(nums) == output;
    }
}
