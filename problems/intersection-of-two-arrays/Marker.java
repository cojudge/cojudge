import java.util.*;
class Marker {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> a = new HashSet<>();
        for (int x : nums1) a.add(x);
        Set<Integer> out = new HashSet<>();
        for (int x : nums2) if (a.contains(x)) out.add(x);
        int[] res = out.stream().mapToInt(Integer::intValue).toArray();
        Arrays.sort(res);
        return res;
    }
    public boolean isCorrect(int[] nums1, int[] nums2, int[] output) {
        if (output == null) return false;
        int[] exp = intersection(nums1, nums2);
        int[] got = Arrays.copyOf(output, output.length);
        Arrays.sort(got);
        // dedupe user output before comparing (duplicates would fail)
        int[] dedup = Arrays.stream(got).distinct().toArray();
        return Arrays.equals(exp, dedup);
    }
}
