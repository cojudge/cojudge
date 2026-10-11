class Marker {
    public int[][] flipAndInvertImage(int[][] image) {
        int n = image.length;
        int[][] ans = new int[n][];
        for (int i = 0; i < n; i++) {
            int m = image[i].length;
            ans[i] = new int[m];
            for (int j = 0; j < m; j++) {
                ans[i][j] = image[i][m - 1 - j] ^ 1;
            }
        }
        return ans;
    }
    public boolean isCorrect(int[][] image, int[][] output) {
        int[][] expected = flipAndInvertImage(image);
        if (expected.length != output.length) return false;
        for (int i = 0; i < expected.length; i++) {
            if (expected[i].length != output[i].length) return false;
            for (int j = 0; j < expected[i].length; j++) {
                if (expected[i][j] != output[i][j]) return false;
            }
        }
        return true;
    }
}
