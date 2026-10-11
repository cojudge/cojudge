import java.util.*;
class Marker {
    public List<List<Integer>> generate(int numRows) {
        List<List<Integer>> ans = new ArrayList<>();
        for (int r = 0; r < numRows; r++) {
            List<Integer> row = new ArrayList<>(r + 1);
            for (int c = 0; c <= r; c++) {
                if (c == 0 || c == r) row.add(1);
                else row.add(ans.get(r - 1).get(c - 1) + ans.get(r - 1).get(c));
            }
            ans.add(row);
        }
        return ans;
    }
    public boolean isCorrect(int numRows, List<List<Integer>> output) {
        List<List<Integer>> exp = generate(numRows);
        if (exp.size() != output.size()) return false;
        for (int i = 0; i < exp.size(); i++) {
            if (!exp.get(i).equals(output.get(i))) return false;
        }
        return true;
    }
}
