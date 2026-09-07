class Marker {
    public int maxTurbulenceSize(int[] arr) {
        int n = arr.length;
        if (n < 2) return n;

        int inc = 1;
        int dec = 1;
        int best = 1;
        for (int i = 1; i < n; i++) {
            if (arr[i - 1] < arr[i]) {
                inc = dec + 1;
                dec = 1;
            } else if (arr[i - 1] > arr[i]) {
                dec = inc + 1;
                inc = 1;
            } else {
                inc = 1;
                dec = 1;
            }
            best = Math.max(best, Math.max(inc, dec));
        }
        return best;
    }

    public boolean isCorrect(int[] arr, int output) {
        return maxTurbulenceSize(arr) == output;
    }
}