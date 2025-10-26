class Marker {
    public int rob(int[] nums) {
        int rob = 0, skip = 0;
        for (int x : nums) {
            int newRob = skip + x;
            skip = Math.max(skip, rob);
            rob = newRob;
        }
        return Math.max(rob, skip);
    }
    public boolean isCorrect(int[] nums, int output) { return rob(nums) == output; }
}
