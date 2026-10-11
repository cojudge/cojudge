import java.util.*;
class Marker {
    public int[] intersect(int[] nums1, int[] nums2) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int x : nums1) count.put(x, count.getOrDefault(x, 0) + 1);
        List<Integer> out = new ArrayList<>();
        for (int x : nums2) {
            int c = count.getOrDefault(x, 0);
            if (c > 0) {
                out.add(x);
                count.put(x, c - 1);
            }
        }
        int[] res = out.stream().mapToInt(Integer::intValue).toArray();
        Arrays.sort(res);
        return res;
    }
    public boolean isCorrect(int[] nums1, int[] nums2, int[] output) {
        if (output == null) return false;
        int[] exp = intersect(nums1, nums2);
        int[] got = Arrays.copyOf(output, output.length);
        Arrays.sort(got);
        return Arrays.equals(exp, got);
    }
}
