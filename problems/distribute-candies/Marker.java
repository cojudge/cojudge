import java.util.*;
class Marker {
    public int distributeCandies(int[] candyType) {
        Set<Integer> set = new HashSet<>();
        for (int c : candyType) set.add(c);
        return Math.min(set.size(), candyType.length / 2);
    }
    public boolean isCorrect(int[] candyType, int output) {
        return output == distributeCandies(candyType);
    }
}
