class Marker {
    public int longestMountain(int[] arr) {
        int n = arr.length, best = 0;
        int i = 1;
        while (i < n - 1) {
            if (arr[i] > arr[i-1] && arr[i] > arr[i+1]) {
                int l = i - 1, r = i + 1;
                while (l > 0 && arr[l] > arr[l-1]) l--;
                while (r + 1 < n && arr[r] > arr[r+1]) r++;
                best = Math.max(best, r - l + 1);
                i = r + 1;
            } else i++;
        }
        return best;
    }
    public boolean isCorrect(int[] arr, int output) {
        return longestMountain(arr) == output;
    }
}
