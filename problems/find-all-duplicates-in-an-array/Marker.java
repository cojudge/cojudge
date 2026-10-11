import java.util.*;
class Marker {
    public List<Integer> findDuplicates(int[] nums) {
        List<Integer> res = new ArrayList<>();
        boolean[] seen = new boolean[nums.length + 1];
        boolean[] added = new boolean[nums.length + 1];
        for (int x : nums) {
            if (x >= 1 && x <= nums.length) {
                if (seen[x] && !added[x]) {
                    res.add(x);
                    added[x] = true;
                }
                seen[x] = true;
            }
        }
        return res;
    }
    public boolean isCorrect(int[] nums, List<Integer> output) {
        if (output == null) return false;
        List<Integer> exp = new ArrayList<>(findDuplicates(nums));
        List<Integer> got = new ArrayList<>(output);
        Collections.sort(exp);
        Collections.sort(got);
        return exp.equals(got);
    }
}
