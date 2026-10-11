import java.util.*;
class Marker {
    public int regionsBySlashes(String grid) {
        String[] rows = grid.split("\\|", -1);
        int n = rows.length;
        int m = 3 * n;
        int[][] pic = new int[m][m];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                char ch = rows[i].charAt(j);
                int bi = 3 * i;
                int bj = 3 * j;
                if (ch == '/') {
                    pic[bi][bj + 2] = 1;
                    pic[bi + 1][bj + 1] = 1;
                    pic[bi + 2][bj] = 1;
                } else if (ch == '\\') {
                    pic[bi][bj] = 1;
                    pic[bi + 1][bj + 1] = 1;
                    pic[bi + 2][bj + 2] = 1;
                }
            }
        }
        int regions = 0;
        int[] dx = {1, -1, 0, 0};
        int[] dy = {0, 0, 1, -1};
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < m; j++) {
                if (pic[i][j] != 0) continue;
                regions++;
                Deque<int[]> stack = new ArrayDeque<>();
                stack.push(new int[]{i, j});
                pic[i][j] = 2;
                while (!stack.isEmpty()) {
                    int[] cur = stack.pop();
                    for (int d = 0; d < 4; d++) {
                        int nx = cur[0] + dx[d];
                        int ny = cur[1] + dy[d];
                        if (nx >= 0 && nx < m && ny >= 0 && ny < m && pic[nx][ny] == 0) {
                            pic[nx][ny] = 2;
                            stack.push(new int[]{nx, ny});
                        }
                    }
                }
            }
        }
        return regions;
    }
    public boolean isCorrect(String grid, int output) {
        return output == regionsBySlashes(grid);
    }
}
