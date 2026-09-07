class Marker {
    private int guess(int num, int pick) {
        if (num > pick) return -1;
        if (num < pick) return 1;
        return 0;
    }

    public int guessNumber(int n, int pick) {
        int left = 1;
        int right = n;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            int r = guess(mid, pick);
            if (r == 0) return mid;
            if (r < 0) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return -1;
    }

    public boolean isCorrect(int n, int pick, int output) {
        return output == guessNumber(n, pick);
    }
}
