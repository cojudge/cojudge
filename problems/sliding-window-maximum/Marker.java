import java.util.Arrays;

class Marker {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int[] result = new int[nums.length - k + 1];
        int[] deque = new int[nums.length];
        int head = 0;
        int tail = 0;

        for (int i = 0; i < nums.length; i++) {
            while (head < tail && deque[head] <= i - k) head++;
            while (head < tail && nums[deque[tail - 1]] <= nums[i]) tail--;
            deque[tail++] = i;

            if (i >= k - 1) {
                result[i - k + 1] = nums[deque[head]];
            }
        }
        return result;
    }

    public boolean isCorrect(int[] nums, int k, int[] output) {
        return output != null && Arrays.equals(output, maxSlidingWindow(nums, k));
    }
}
