import java.util.*;
class Marker {
    public int[] runSnakeGame(int width, int height, int[][] food, String[] moves) {
        Deque<int[]> body = new ArrayDeque<>();
        body.offerFirst(new int[]{0, 0});
        Set<Long> occ = new HashSet<>();
        occ.add(0L);
        int fi = 0, score = 0;
        List<Integer> ans = new ArrayList<>();
        boolean over = false;
        if (moves != null) {
            for (String mv : moves) {
                if (over) { ans.add(-1); continue; }
                int[] h = body.peekFirst();
                int r = h[0], c = h[1];
                if (mv.equals("U")) r--;
                else if (mv.equals("D")) r++;
                else if (mv.equals("L")) c--;
                else if (mv.equals("R")) c++;
                else { ans.add(-1); over = true; continue; }
                if (r < 0 || r >= height || c < 0 || c >= width) { ans.add(-1); over = true; continue; }
                boolean eat = fi < food.length && food[fi][0] == r && food[fi][1] == c;
                if (!eat) {
                    int[] tail = body.pollLast();
                    occ.remove(((long) tail[0]) * width + tail[1]);
                }
                long key = ((long) r) * width + c;
                if (occ.contains(key)) { ans.add(-1); over = true; continue; }
                body.offerFirst(new int[]{r, c});
                occ.add(key);
                if (eat) { fi++; score++; }
                ans.add(score);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(int width, int height, int[][] food, String[] moves, int[] output) {
        return Arrays.equals(runSnakeGame(width, height, food, moves), output);
    }
}
