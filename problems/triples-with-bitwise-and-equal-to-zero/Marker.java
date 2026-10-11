import java.util.*;
class Marker {
    public int countTriplets(int[] nums) {
        Map<Integer, Integer> pairCnt = new HashMap<>();
        for (int a : nums) {
            for (int b : nums) {
                int v = a & b;
                pairCnt.put(v, pairCnt.getOrDefault(v, 0) + 1);
            }
        }
        int ans = 0;
        for (Map.Entry<Integer, Integer> e : pairCnt.entrySet()) {
            int p = e.getKey();
            int c = e.getValue();
            for (int x : nums) {
                if ((p & x) == 0) ans += c;
            }
        }
        return ans;
    }
    public boolean isCorrect(int[] nums, int output) {
        return countTriplets(nums) == output;
    }
}
