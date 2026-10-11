class Marker {
    public int findMaxConsecutiveOnes(int[] nums) {
        int best = 0, cur = 0;
        for (int v : nums) {
            if (v == 1) {
                cur++;
                if (cur > best) best = cur;
            } else {
                cur = 0;
            }
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return findMaxConsecutiveOnes(nums) == output;
    }
}
