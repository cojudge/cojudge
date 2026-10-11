import java.util.*;
class Marker {
    public int hIndex(int[] citations) {
        Arrays.sort(citations);
        int n = citations.length;
        for (int h = n; h > 0; h--) {
            if (citations[n - h] >= h) return h;
        }
        return 0;
    }
    public boolean isCorrect(int[] citations, int output) {
        return output == hIndex(citations);
    }
}
