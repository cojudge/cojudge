import java.util.*;

class Marker {
    public int[] stockSpan(int[] prices) {
        int n = prices.length;
        int[] spans = new int[n];
        Deque<Integer> priceStack = new ArrayDeque<>();
        Deque<Integer> spanStack = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            int span = 1;
            while (!priceStack.isEmpty() && priceStack.peek() <= prices[i]) {
                priceStack.pop();
                span += spanStack.pop();
            }
            priceStack.push(prices[i]);
            spanStack.push(span);
            spans[i] = span;
        }
        return spans;
    }

    public boolean isCorrect(int[] prices, int[] output) {
        return output != null && Arrays.equals(stockSpan(prices), output);
    }
}
