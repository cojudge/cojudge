import java.util.*;
class Marker {
    public boolean canCross(int[] stones) {
        int n = stones.length;
        if (n <= 1) return true;
        if (stones[1] != 1) return false;
        Map<Integer, Integer> indexOf = new HashMap<>();
        for (int i = 0; i < n; i++) indexOf.put(stones[i], i);
        Map<Integer, Set<Integer>> reach = new HashMap<>();
        for (int i = 0; i < n; i++) reach.put(i, new HashSet<>());
        reach.get(0).add(0);
        for (int i = 0; i < n; i++) {
            for (int k : new ArrayList<>(reach.get(i))) {
                for (int nk = k - 1; nk <= k + 1; nk++) {
                    if (nk <= 0) continue;
                    int nextPos = stones[i] + nk;
                    Integer j = indexOf.get(nextPos);
                    if (j != null) reach.get(j).add(nk);
                }
            }
        }
        return !reach.get(n - 1).isEmpty();
    }
    public boolean isCorrect(int[] stones, boolean output) {
        return canCross(stones) == output;
    }
}
