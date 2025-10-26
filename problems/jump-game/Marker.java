class Marker {
    public boolean canJump(int[] nums) {
        int reach = 0;
        for (int i = 0; i <= reach && i < nums.length; i++) {
            reach = Math.max(reach, i + nums[i]);
        }
        return reach >= nums.length - 1;
    }
    public boolean isCorrect(int[] nums, boolean output) { return canJump(nums) == output; }
}
