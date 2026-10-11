class Marker {
    private boolean isBad(int v, int bad) {
        return v >= bad;
    }
    public int firstBadVersion(int n, int bad) {
        int lo = 1, hi = n, ans = n;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (isBad(mid, bad)) {
                ans = mid;
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        }
        return ans;
    }
    public boolean isCorrect(int n, int bad, int output) {
        return output == firstBadVersion(n, bad);
    }
}
