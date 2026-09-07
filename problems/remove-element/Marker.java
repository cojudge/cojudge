class Marker {
    public int removeElement(int[] nums, int val) {
        int k = 0;
        for (int x : nums) {
            if (x != val) nums[k++] = x;
        }
        return k;
    }
    public boolean isCorrect(int[] nums, int val, int output) {
        return removeElement(nums.clone(), val) == output;
    }
}
