import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        StockSpanner obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("StockSpanner")) {
                obj = new StockSpanner();
                result.add("null");
            } else if (op.equals("next")) {
                result.add(String.valueOf(obj.next(values[i][0])));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        Deque<Integer> priceStack = new ArrayDeque<>();
        Deque<Integer> spanStack = new ArrayDeque<>();
        boolean live = false;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String got = output.get(i).trim();
            if (op.equals("StockSpanner")) {
                if (!got.equals("null")) return false;
                live = true;
                priceStack.clear();
                spanStack.clear();
            } else if (op.equals("next")) {
                if (!live) return false;
                if (values[i] == null || values[i].length < 1) return false;
                int price = values[i][0];
                int span = 1;
                while (!priceStack.isEmpty() && priceStack.peek() <= price) {
                    priceStack.pop();
                    span += spanStack.pop();
                }
                priceStack.push(price);
                spanStack.push(span);
                int exp;
                try {
                    exp = Integer.parseInt(got);
                } catch (NumberFormatException e) {
                    return false;
                }
                if (exp != span) return false;
            } else {
                return false;
            }
        }
        return live;
    }

    static class StockSpanner {
        private final Deque<Integer> prices = new ArrayDeque<>();
        private final Deque<Integer> spans = new ArrayDeque<>();
        int next(int price) {
            int span = 1;
            while (!prices.isEmpty() && prices.peek() <= price) {
                prices.pop();
                span += spans.pop();
            }
            prices.push(price);
            spans.push(span);
            return span;
        }
    }
}
