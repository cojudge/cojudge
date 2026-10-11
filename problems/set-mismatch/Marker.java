import java.util.*;
class Marker {
    public int[] findErrorNums(int[] nums) {
        int n = nums.length;
        boolean[] seen = new boolean[n + 1];
        int dup = -1;
        long sum = 0;
        Set<Integer> distinct = new HashSet<>();
        for (int v : nums) {
            if (seen[v]) dup = v;
            seen[v] = true;
            distinct.add(v);
        }
        for (int v : distinct) sum += v;
        long expect = (long) n * (n + 1) / 2;
        int missing = (int) (expect - sum);
        return new int[]{dup, missing};
    }
    public boolean isCorrect(int[] nums, int[] output) {
        return output != null && Arrays.equals(findErrorNums(nums), output);
    }
}
