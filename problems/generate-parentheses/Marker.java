import java.util.*;

class Marker {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        build(n, 0, 0, new StringBuilder(), result);
        return result;
    }

    private void build(int n, int opened, int closed, StringBuilder current,
                       List<String> result) {
        if (current.length() == n * 2) {
            result.add(current.toString());
            return;
        }
        if (opened < n) {
            current.append('(');
            build(n, opened + 1, closed, current, result);
            current.deleteCharAt(current.length() - 1);
        }
        if (closed < opened) {
            current.append(')');
            build(n, opened, closed + 1, current, result);
            current.deleteCharAt(current.length() - 1);
        }
    }

    public boolean isCorrect(int n, List<String> output) {
        if (output == null || output.stream().anyMatch(Objects::isNull)) return false;
        List<String> expected = generateParenthesis(n);
        List<String> actual = new ArrayList<>(output);
        Collections.sort(expected);
        Collections.sort(actual);
        return expected.equals(actual);
    }
}
