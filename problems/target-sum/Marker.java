class Marker {
    public int findTargetSumWays(int[] nums, int target) {
        int sum = 0;
        for (int num : nums) sum += num;
        if (target < -sum || target > sum) return 0;

        int offset = sum;
        int[] ways = new int[2 * sum + 1];
        ways[offset] = 1;
        int reachable = 0;
        for (int num : nums) {
            int[] next = new int[ways.length];
            for (int value = -reachable; value <= reachable; value++) {
                int count = ways[value + offset];
                if (count == 0) continue;
                next[value + num + offset] += count;
                next[value - num + offset] += count;
            }
            ways = next;
            reachable += num;
        }
        return ways[target + offset];
    }

    public boolean isCorrect(int[] nums, int target, int output) {
        return output == findTargetSumWays(nums, target);
    }
}
