import java.util.*;
class Marker {
    public int shortestBridge(int[][] grid) {
        int n = grid.length;
        boolean[][] seen = new boolean[n][n];
        Deque<int[]> q = new ArrayDeque<>();
        boolean found = false;
        for (int i = 0; i < n && !found; i++) {
            for (int j = 0; j < n && !found; j++) {
                if (grid[i][j] == 1) {
                    Deque<int[]> st = new ArrayDeque<>();
                    st.push(new int[]{i, j});
                    seen[i][j] = true;
                    while (!st.isEmpty()) {
                        int[] c = st.pop();
                        q.add(c);
                        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
                        for (int[] d : dirs) {
                            int ni = c[0]+d[0], nj = c[1]+d[1];
                            if (ni>=0&&ni<n&&nj>=0&&nj<n&&!seen[ni][nj]&&grid[ni][nj]==1) {
                                seen[ni][nj]=true; st.push(new int[]{ni,nj});
                            }
                        }
                    }
                    found = true;
                }
            }
        }
        int steps = 0;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int k = 0; k < sz; k++) {
                int[] c = q.poll();
                for (int[] d : dirs) {
                    int ni = c[0]+d[0], nj = c[1]+d[1];
                    if (ni<0||ni>=n||nj<0||nj>=n||seen[ni][nj]) continue;
                    if (grid[ni][nj]==1) return steps;
                    seen[ni][nj]=true;
                    q.add(new int[]{ni,nj});
                }
            }
            steps++;
        }
        return -1;
    }
    public boolean isCorrect(int[][] grid, int output) {
        return shortestBridge(grid) == output;
    }
}
