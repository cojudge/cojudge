import java.util.*;
class Marker {
    public int[] majorityElement(int[] nums) {
        int c1 = 0, c2 = 0, n1 = 0, n2 = 0;
        boolean has1 = false, has2 = false;
        for (int x : nums) {
            if (has1 && x == c1) n1++;
            else if (has2 && x == c2) n2++;
            else if (n1 == 0) { c1 = x; n1 = 1; has1 = true; }
            else if (n2 == 0) { c2 = x; n2 = 1; has2 = true; }
            else { n1--; n2--; }
        }
        n1 = 0; n2 = 0;
        for (int x : nums) {
            if (has1 && x == c1) n1++;
            if (has2 && x == c2) n2++;
        }
        List<Integer> res = new ArrayList<>();
        int th = nums.length / 3;
        if (has1 && n1 > th) res.add(c1);
        if (has2 && c2 != c1 && n2 > th) res.add(c2);
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(int[] nums, int[] output) {
        if (output == null) return false;
        int[] exp = majorityElement(nums);
        Arrays.sort(exp);
        int[] got = output.clone();
        Arrays.sort(got);
        return Arrays.equals(exp, got);
    }
}
