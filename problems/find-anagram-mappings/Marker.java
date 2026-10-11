import java.util.*;
class Marker {
    public int[] anagramMappings(int[] nums1, int[] nums2) {
        Map<Integer, Queue<Integer>> pos = new HashMap<>();
        for (int i = 0; i < nums2.length; i++) {
            pos.computeIfAbsent(nums2[i], k -> new LinkedList<>()).add(i);
        }
        int[] ans = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            ans[i] = pos.get(nums1[i]).poll();
        }
        return ans;
    }
    public boolean isCorrect(int[] nums1, int[] nums2, int[] output) {
        if (output == null || output.length != nums1.length) return false;
        boolean[] used = new boolean[nums2.length];
        for (int i = 0; i < nums1.length; i++) {
            int j = output[i];
            if (j < 0 || j >= nums2.length || used[j]) return false;
            used[j] = true;
            if (nums1[i] != nums2[j]) return false;
        }
        return true;
    }
}
