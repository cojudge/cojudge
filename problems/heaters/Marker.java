import java.util.*;
class Marker {
    public int findRadius(int[] houses, int[] heaters) {
        Arrays.sort(houses);
        Arrays.sort(heaters);
        int ans = 0;
        for (int h : houses) {
            int idx = Arrays.binarySearch(heaters, h);
            if (idx >= 0) continue;
            int ins = -idx - 1;
            int best = Integer.MAX_VALUE;
            if (ins < heaters.length) best = Math.min(best, heaters[ins] - h);
            if (ins > 0) best = Math.min(best, h - heaters[ins - 1]);
            ans = Math.max(ans, best);
        }
        return ans;
    }
    public boolean isCorrect(int[] houses, int[] heaters, int output) {
        return findRadius(houses.clone(), heaters.clone()) == output;
    }
}
