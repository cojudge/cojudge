class Marker {
    public int minArea(char[][] image, int x, int y) {
        int top = x, bottom = x, left = y, right = y;
        for (int i = 0; i < image.length; i++) {
            for (int j = 0; j < image[i].length; j++) {
                if (image[i][j] == '1') {
                    if (i < top) top = i;
                    if (i > bottom) bottom = i;
                    if (j < left) left = j;
                    if (j > right) right = j;
                }
            }
        }
        return (bottom - top + 1) * (right - left + 1);
    }
    public boolean isCorrect(char[][] image, int x, int y, int output) {
        return minArea(image, x, y) == output;
    }
}
