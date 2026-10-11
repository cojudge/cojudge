import java.util.*;
class Marker {
    public int findLHS(int[] nums) {
        Map<Integer,Integer> f = new HashMap<>();
        for (int x : nums) f.put(x, f.getOrDefault(x, 0)+1);
        int best = 0;
        for (int k : f.keySet()) if (f.containsKey(k+1)) best = Math.max(best, f.get(k)+f.get(k+1));
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == findLHS(nums);
    }
}
