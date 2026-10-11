import java.util.*;
class Marker {
    public List<Integer> diffWaysToCompute(String expression) {
        List<Integer> res = new ArrayList<>();
        for (int i = 0; i < expression.length(); i++) {
            char c = expression.charAt(i);
            if (c == '+' || c == '-' || c == '*') {
                List<Integer> left = diffWaysToCompute(expression.substring(0, i));
                List<Integer> right = diffWaysToCompute(expression.substring(i + 1));
                for (int a : left) {
                    for (int b : right) {
                        if (c == '+') res.add(a + b);
                        else if (c == '-') res.add(a - b);
                        else res.add(a * b);
                    }
                }
            }
        }
        if (res.isEmpty()) res.add(Integer.parseInt(expression));
        return res;
    }

    public boolean isCorrect(String expression, List<Integer> output) {
        if (output == null) return false;
        List<Integer> expected = new ArrayList<>(diffWaysToCompute(expression));
        List<Integer> actual = new ArrayList<>(output);
        Collections.sort(expected);
        Collections.sort(actual);
        return expected.equals(actual);
    }
}
