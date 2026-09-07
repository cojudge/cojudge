import java.util.*;

class Marker {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        int n = profits.length;
        Integer[] index = new Integer[n];
        for (int i = 0; i < n; i++) index[i] = i;
        Arrays.sort(index, (a, b) -> capital[a] - capital[b]);

        PriorityQueue<Integer> maxProfit = new PriorityQueue<>(Collections.reverseOrder());
        long currentCapital = w;
        int i = 0;
        for (int round = 0; round < k; round++) {
            while (i < n && capital[index[i]] <= currentCapital) {
                maxProfit.add(profits[index[i]]);
                i++;
            }
            if (maxProfit.isEmpty()) break;
            currentCapital += maxProfit.poll();
        }
        return (int) currentCapital;
    }

    public boolean isCorrect(int k, int w, int[] profits, int[] capital, int output) {
        return findMaximizedCapital(k, w, profits, capital) == output;
    }
}