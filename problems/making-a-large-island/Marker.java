import java.util.*;
class Marker {
    public int largestIsland(int[][] grid) {
        int n = grid.length;
        int[][] id = new int[n][n];
        Map<Integer, Integer> size = new HashMap<>();
        int cur = 2;
        int best = 0;
        int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 1 && id[i][j] == 0) {
                    int s = 0;
                    Deque<int[]> st = new ArrayDeque<>();
                    st.push(new int[]{i, j});
                    id[i][j] = cur;
                    while (!st.isEmpty()) {
                        int[] c = st.pop();
                        s++;
                        for (int[] d : dirs) {
                            int ni = c[0] + d[0], nj = c[1] + d[1];
                            if (ni >= 0 && ni < n && nj >= 0 && nj < n
                                    && grid[ni][nj] == 1 && id[ni][nj] == 0) {
                                id[ni][nj] = cur;
                                st.push(new int[]{ni, nj});
                            }
                        }
                    }
                    size.put(cur, s);
                    best = Math.max(best, s);
                    cur++;
                }
            }
        }
        boolean hasZero = false;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 0) {
                    hasZero = true;
                    Set<Integer> seen = new HashSet<>();
                    for (int[] d : dirs) {
                        int ni = i + d[0], nj = j + d[1];
                        if (ni >= 0 && ni < n && nj >= 0 && nj < n && id[ni][nj] != 0) {
                            seen.add(id[ni][nj]);
                        }
                    }
                    int tot = 1;
                    for (int k : seen) tot += size.get(k);
                    best = Math.max(best, tot);
                }
            }
        }
        return hasZero ? best : n * n;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return largestIsland(grid) == output;
    }
}
