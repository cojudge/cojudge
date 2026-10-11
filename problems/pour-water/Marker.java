import java.util.*;
class Marker {
    public int[] pourWater(int[] heights, int volume, int k) {
        int n = heights.length;
        for (int v = 0; v < volume; v++) {
            int best = k;
            for (int i = k - 1; i >= 0; i--) {
                if (heights[i] > heights[best]) break;
                if (heights[i] < heights[best]) best = i;
            }
            if (best != k) { heights[best]++; continue; }
            best = k;
            for (int i = k + 1; i < n; i++) {
                if (heights[i] > heights[best]) break;
                if (heights[i] < heights[best]) best = i;
            }
            heights[best]++;
        }
        return heights;
    }
    public boolean isCorrect(int[] heights, int volume, int k, int[] output) {
        return Arrays.equals(pourWater(heights.clone(), volume, k), output);
    }
}
