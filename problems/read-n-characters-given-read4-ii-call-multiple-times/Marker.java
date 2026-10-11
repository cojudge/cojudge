import java.util.*;
class Marker {
    public List<String> read(String file, int[] queries) {
        List<String> ans = new ArrayList<>();
        if (file == null) file = "";
        int pos = 0;
        // leftover buffer simulating read4 remainder carried across calls
        StringBuilder leftover = new StringBuilder();
        for (int q : queries) {
            StringBuilder chunk = new StringBuilder();
            int need = Math.max(q, 0);
            while (need > 0) {
                if (leftover.length() == 0) {
                    if (pos >= file.length()) break;
                    int take = Math.min(4, file.length() - pos);
                    leftover.append(file, pos, pos + take);
                    pos += take;
                }
                int use = Math.min(need, leftover.length());
                chunk.append(leftover, 0, use);
                leftover.delete(0, use);
                need -= use;
            }
            ans.add(chunk.toString());
        }
        return ans;
    }
    public boolean isCorrect(String file, int[] queries, List<String> output) {
        List<String> expected = read(file, queries);
        return expected.equals(output);
    }
}
