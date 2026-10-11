import java.util.*;
class Marker {
    public int findLongestChain(int[][] pairs) {
        Arrays.sort(pairs, (a, b) -> Integer.compare(a[1], b[1]));
        int count = 0, end = Integer.MIN_VALUE;
        boolean first = true;
        for (int[] p : pairs) {
            if (first || p[0] > end) {
                count++;
                end = p[1];
                first = false;
            }
        }
        return count;
    }
    public boolean isCorrect(int[][] pairs, int output) {
        return findLongestChain(pairs.clone()) == output;
    }
}
