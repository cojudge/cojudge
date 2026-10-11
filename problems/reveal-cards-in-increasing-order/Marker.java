import java.util.*;
class Marker {
    public int[] deckRevealedIncreasing(int[] deck) {
        int n = deck.length;
        int[] sorted = deck.clone();
        Arrays.sort(sorted);
        Deque<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            q.offer(i);
        }
        int[] ans = new int[n];
        for (int card : sorted) {
            int idx = q.poll();
            ans[idx] = card;
            if (!q.isEmpty()) {
                q.offer(q.poll());
            }
        }
        return ans;
    }
    public boolean isCorrect(int[] deck, int[] output) {
        return Arrays.equals(deckRevealedIncreasing(deck), output);
    }
}
