class Marker {
    public int findMaxConsecutiveOnes(int[] nums) {
        int best = 0;
        int left = 0;
        int zeros = 0;
        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) zeros++;
            while (zeros > 1) {
                if (nums[left] == 0) zeros--;
                left++;
            }
            int len = right - left + 1;
            if (len > best) best = len;
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return findMaxConsecutiveOnes(nums) == output;
    }
}
