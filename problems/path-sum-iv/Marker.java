import java.util.*;
class Marker {
    public int pathSum(int[] nums) {
        Map<Integer,Integer> val = new HashMap<>();
        for (int x : nums) {
            int d = x / 100, p = (x / 10) % 10, v = x % 10;
            val.put(d * 10 + p, v);
        }
        return dfs(1, 1, 0, val);
    }
    private int dfs(int d, int p, int cur, Map<Integer,Integer> val) {
        Integer v = val.get(d * 10 + p);
        if (v == null) return 0;
        cur += v;
        boolean hasL = val.containsKey((d+1)*10 + (2*p-1));
        boolean hasR = val.containsKey((d+1)*10 + (2*p));
        if (!hasL && !hasR) return cur;
        return dfs(d+1, 2*p-1, cur, val) + dfs(d+1, 2*p, cur, val);
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == pathSum(nums.clone());
    }
}
