import java.util.*;
class Marker {
    public int totalFruit(int[] fruits) {
        Map<Integer, Integer> cnt = new HashMap<>();
        int left = 0, best = 0;
        for (int right = 0; right < fruits.length; right++) {
            cnt.put(fruits[right], cnt.getOrDefault(fruits[right], 0) + 1);
            while (cnt.size() > 2) {
                int c = cnt.get(fruits[left]) - 1;
                if (c == 0) cnt.remove(fruits[left]);
                else cnt.put(fruits[left], c);
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
    public boolean isCorrect(int[] fruits, int output) {
        return totalFruit(fruits) == output;
    }
}
