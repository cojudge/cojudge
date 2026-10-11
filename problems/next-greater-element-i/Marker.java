import java.util.*;
class Marker {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        Map<Integer,Integer> next = new HashMap<>();
        Deque<Integer> st = new ArrayDeque<>();
        for (int x : nums2) {
            while (!st.isEmpty() && x > st.peek()) next.put(st.pop(), x);
            st.push(x);
        }
        while (!st.isEmpty()) next.put(st.pop(), -1);
        int[] ans = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) ans[i] = next.getOrDefault(nums1[i], -1);
        return ans;
    }
    public boolean isCorrect(int[] nums1, int[] nums2, int[] output) {
        return Arrays.equals(nextGreaterElement(nums1, nums2), output);
    }
}
