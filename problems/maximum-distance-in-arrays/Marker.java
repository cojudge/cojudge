import java.util.*;
class Marker {
    public int maxDistance(int[][] arrays) {
        int minV = arrays[0][0];
        int maxV = arrays[0][arrays[0].length - 1];
        int ans = 0;
        for (int i = 1; i < arrays.length; i++) {
            int first = arrays[i][0];
            int last = arrays[i][arrays[i].length - 1];
            ans = Math.max(ans, Math.abs(last - minV));
            ans = Math.max(ans, Math.abs(maxV - first));
            minV = Math.min(minV, first);
            maxV = Math.max(maxV, last);
        }
        return ans;
    }
    public boolean isCorrect(int[][] arrays, int output) {
        return maxDistance(arrays) == output;
    }
}
