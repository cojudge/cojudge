import java.util.*;
class Marker {
    public List<String> staircase(int n) {
        List<String> rows = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < i; j++) sb.append('*');
            rows.add(sb.toString());
        }
        return rows;
    }
    public boolean isCorrect(int n, List<String> output) {
        List<String> expected = staircase(n); return expected.equals(output);
    }
}
