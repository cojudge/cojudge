import java.util.*;
class Marker {
    public boolean canReorderDoubled(int[] arr) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int v : arr) {
            cnt.put(v, cnt.getOrDefault(v, 0) + 1);
        }
        List<Integer> keys = new ArrayList<>(cnt.keySet());
        Collections.sort(keys, (a, b) -> Integer.compare(Math.abs(a), Math.abs(b)));
        for (int x : keys) {
            int c = cnt.getOrDefault(x, 0);
            if (c == 0) continue;
            if (x == 0) {
                if (c % 2 != 0) return false;
                cnt.put(x, 0);
                continue;
            }
            int target = x * 2;
            int have = cnt.getOrDefault(target, 0);
            if (have < c) return false;
            cnt.put(target, have - c);
        }
        return true;
    }
    public boolean isCorrect(int[] arr, boolean output) {
        return canReorderDoubled(arr) == output;
    }
}
