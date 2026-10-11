import java.util.*;
class Marker {
    public int snakesAndLadders(int[][] board) {
        int n = board.length;
        int target = n * n;
        int[] dist = new int[target + 1];
        Arrays.fill(dist, -1);
        ArrayDeque<Integer> q = new ArrayDeque<>();
        dist[1] = 0;
        q.add(1);
        while (!q.isEmpty()) {
            int cur = q.poll();
            if (cur == target) return dist[cur];
            for (int nxt = cur + 1; nxt <= Math.min(cur + 6, target); nxt++) {
                int r = n - 1 - (nxt - 1) / n;
                int c = ((nxt - 1) / n) % 2 == 0 ? (nxt - 1) % n : n - 1 - (nxt - 1) % n;
                int dest = board[r][c] != -1 ? board[r][c] : nxt;
                if (dist[dest] == -1) {
                    dist[dest] = dist[cur] + 1;
                    q.add(dest);
                }
            }
        }
        return -1;
    }
    public boolean isCorrect(int[][] board, int output) {
        return snakesAndLadders(board) == output;
    }
}
