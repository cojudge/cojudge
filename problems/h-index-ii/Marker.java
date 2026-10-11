class Marker {
    public int hIndex(int[] citations) {
        int n = citations.length;
        int lo = 0, hi = n;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            int h = n - mid;
            if (citations[mid] >= h) hi = mid;
            else lo = mid + 1;
        }
        int h = n - lo;
        if (lo < n && citations[lo] >= h) return h;
        return 0;
    }
    public boolean isCorrect(int[] citations, int output) {
        return output == hIndex(citations);
    }
}
