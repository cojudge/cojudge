class Marker {
    public boolean isIdealPermutation(int[] nums) {
        int cmax = -1;
        for (int i = 2; i < nums.length; i++) {
            cmax = Math.max(cmax, nums[i - 2]);
            if (cmax > nums[i]) return false;
        }
        return true;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return output == isIdealPermutation(nums);
    }
}
