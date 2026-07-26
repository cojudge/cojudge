class Marker {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int value : nums) result ^= value;
        return result;
    }

    public boolean isCorrect(int[] nums, int output) {
        return output == singleNumber(nums);
    }
}
