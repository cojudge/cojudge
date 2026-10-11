import java.util.*;
class Marker {
    public List<List<Integer>> largeGroupPositions(String s) {
        List<List<Integer>> ans = new ArrayList<>();
        int n = s.length();
        int start = 0;
        for (int i = 0; i <= n; i++) {
            if (i == n || s.charAt(i) != s.charAt(start)) {
                if (i - start >= 3) {
                    ans.add(Arrays.asList(start, i - 1));
                }
                start = i;
            }
        }
        return ans;
    }
    public boolean isCorrect(String s, List<List<Integer>> output) {
        return largeGroupPositions(s).equals(output);
    }
}
