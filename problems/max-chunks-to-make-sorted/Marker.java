class Marker {
    public int maxChunksToSorted(int[] arr) {
        int chunks = 0, mx = -1;
        for (int i = 0; i < arr.length; i++) {
            mx = Math.max(mx, arr[i]);
            if (mx == i) chunks++;
        }
        return chunks;
    }
    public boolean isCorrect(int[] arr, int output) {
        return output == maxChunksToSorted(arr);
    }
}
