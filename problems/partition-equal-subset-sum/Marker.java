class Marker {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;
        if ((sum & 1) == 1) return false;

        int target = sum / 2;
        boolean[] reachable = new boolean[target + 1];
        reachable[0] = true;
        for (int num : nums) {
            for (int value = target; value >= num; value--) {
                reachable[value] |= reachable[value - num];
            }
            if (reachable[target]) return true;
        }
        return false;
    }

    public boolean isCorrect(int[] nums, boolean output) {
        return output == canPartition(nums);
    }
}
