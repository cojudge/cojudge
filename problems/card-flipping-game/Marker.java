import java.util.*;
class Marker {
    public int flipgame(int[] fronts, int[] backs) {
        Set<Integer> bad = new HashSet<>();
        for (int i = 0; i < fronts.length; i++)
            if (fronts[i] == backs[i]) bad.add(fronts[i]);
        int ans = Integer.MAX_VALUE;
        for (int v : fronts) if (!bad.contains(v)) ans = Math.min(ans, v);
        for (int v : backs) if (!bad.contains(v)) ans = Math.min(ans, v);
        return ans == Integer.MAX_VALUE ? 0 : ans;
    }
    public boolean isCorrect(int[] fronts, int[] backs, int output) {
        return flipgame(fronts, backs) == output;
    }
}
