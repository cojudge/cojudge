import java.util.*;
class Marker {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        int old = image[sr][sc];
        if (old == color) return image;
        int m = image.length, n = image[0].length;
        Deque<int[]> st = new ArrayDeque<>();
        st.push(new int[]{sr, sc});
        image[sr][sc] = color;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!st.isEmpty()) {
            int[] c = st.pop();
            for (int[] d : dirs) {
                int r = c[0] + d[0], col = c[1] + d[1];
                if (r >= 0 && r < m && col >= 0 && col < n && image[r][col] == old) {
                    image[r][col] = color;
                    st.push(new int[]{r, col});
                }
            }
        }
        return image;
    }
    public boolean isCorrect(int[][] image, int sr, int sc, int color, int[][] output) {
        return Arrays.deepEquals(floodFill(image, sr, sc, color), output);
    }
}
