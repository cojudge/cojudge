import java.util.*;
class Marker {
    public int maxWidthRamp(int[] nums) {
        int n = nums.length;
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (st.isEmpty() || nums[i] < nums[st.peekLast()]) st.addLast(i);
        }
        int best = 0;
        for (int j = n - 1; j >= 0; j--) {
            while (!st.isEmpty() && nums[st.peekLast()] <= nums[j]) {
                best = Math.max(best, j - st.pollLast());
            }
            if (st.isEmpty()) break;
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == maxWidthRamp(nums);
    }
}
