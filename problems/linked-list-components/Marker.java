import java.util.*;
class Marker {
    public int numComponents(ListNode head, int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int v : nums) set.add(v);
        int ans = 0;
        boolean inRun = false;
        for (ListNode p = head; p != null; p = p.next) {
            if (set.contains(p.val)) {
                if (!inRun) { ans++; inRun = true; }
            } else inRun = false;
        }
        return ans;
    }
    public boolean isCorrect(ListNode head, int[] nums, int output) {
        return numComponents(head, nums) == output;
    }
}
