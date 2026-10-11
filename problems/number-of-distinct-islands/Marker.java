import java.util.*;
class Marker {
    public int numDistinctIslands(int[][] grid) {
        int R = grid.length, C = grid[0].length;
        boolean[][] seen = new boolean[R][C];
        Set<String> shapes = new HashSet<>();
        for (int r = 0; r < R; r++) {
            for (int c = 0; c < C; c++) {
                if (grid[r][c] == 1 && !seen[r][c]) {
                    List<int[]> cells = new ArrayList<>();
                    Deque<int[]> st = new ArrayDeque<>();
                    st.push(new int[]{r, c});
                    seen[r][c] = true;
                    while (!st.isEmpty()) {
                        int[] cur = st.pop();
                        cells.add(cur);
                        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
                        for (int[] d : dirs) {
                            int nr = cur[0] + d[0], nc = cur[1] + d[1];
                            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] == 1 && !seen[nr][nc]) {
                                seen[nr][nc] = true;
                                st.push(new int[]{nr, nc});
                            }
                        }
                    }
                    int r0 = cells.get(0)[0], c0 = cells.get(0)[1];
                    // use min row/col as origin for stability
                    int minR = R, minC = C;
                    for (int[] cell : cells) { minR = Math.min(minR, cell[0]); minC = Math.min(minC, cell[1]); }
                    List<String> rel = new ArrayList<>();
                    for (int[] cell : cells) rel.add((cell[0]-minR) + "," + (cell[1]-minC));
                    Collections.sort(rel);
                    shapes.add(String.join(";", rel));
                }
            }
        }
        return shapes.size();
    }
    public boolean isCorrect(int[][] grid, int output) {
        int[][] copy = new int[grid.length][];
        for (int i = 0; i < grid.length; i++) copy[i] = grid[i].clone();
        return numDistinctIslands(copy) == output;
    }
}
