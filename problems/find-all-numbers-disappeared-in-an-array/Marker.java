import java.util.*;
class Marker {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int n = nums.length;
        boolean[] present = new boolean[n + 1];
        for (int x : nums) if (x >= 1 && x <= n) present[x] = true;
        List<Integer> res = new ArrayList<>();
        for (int i = 1; i <= n; i++) if (!present[i]) res.add(i);
        return res;
    }
    public boolean isCorrect(int[] nums, List<Integer> output) {
        if (output == null) return false;
        return findDisappearedNumbers(nums).equals(output);
    }
}
