import java.util.*;
class Marker {
    public int numJewelsInStones(String jewels, String stones) {
        Set<Character> set = new HashSet<>();
        for (char c : jewels.toCharArray()) set.add(c);
        int ans = 0;
        for (char c : stones.toCharArray()) if (set.contains(c)) ans++;
        return ans;
    }
    public boolean isCorrect(String jewels, String stones, int output) {
        return output == numJewelsInStones(jewels, stones);
    }
}
