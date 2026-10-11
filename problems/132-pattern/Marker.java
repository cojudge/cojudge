import java.util.*;
class Marker {
    public boolean find132pattern(int[] nums) {
        Deque<Integer> st = new ArrayDeque<>();
        int third = Integer.MIN_VALUE;
        for (int i = nums.length - 1; i >= 0; i--) {
            if (nums[i] < third) return true;
            while (!st.isEmpty() && nums[i] > st.peek()) third = st.pop();
            st.push(nums[i]);
        }
        return false;
    }
    public boolean isCorrect(int[] nums, boolean output) {
        return find132pattern(nums) == output;
    }
}
