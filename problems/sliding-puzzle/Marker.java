import java.util.*;
class Marker {
    public int slidingPuzzle(int[][] board) {
        String start = "" + board[0][0] + board[0][1] + board[0][2] + board[1][0] + board[1][1] + board[1][2];
        String target = "123450";
        if (start.equals(target)) return 0;
        int[][] nbr = {{1,3},{0,2,4},{1,5},{0,4},{1,3,5},{2,4}};
        Queue<String> q = new LinkedList<>();
        Set<String> seen = new HashSet<>();
        q.add(start);
        seen.add(start);
        int dist = 0;
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int k = 0; k < sz; k++) {
                String cur = q.poll();
                if (cur.equals(target)) return dist;
                int z = cur.indexOf('0');
                for (int nb : nbr[z]) {
                    char[] a = cur.toCharArray();
                    char t = a[z]; a[z] = a[nb]; a[nb] = t;
                    String nxt = new String(a);
                    if (seen.add(nxt)) q.add(nxt);
                }
            }
            dist++;
        }
        return -1;
    }
    public boolean isCorrect(int[][] board, int output) {
        return output == slidingPuzzle(board);
    }
}
