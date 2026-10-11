import java.util.*;
class Marker {
    static class ExamRoom {
        int N;
        TreeSet<Integer> occ = new TreeSet<>();
        ExamRoom(int n) { N = n; }
        int seat() {
            if (occ.isEmpty()) { occ.add(0); return 0; }
            int best = -1, bestDist = -1;
            int first = occ.first();
            if (first != 0) { best = 0; bestDist = first; }
            Integer prev = null;
            for (int cur : occ) {
                if (prev != null) {
                    int cand = (prev + cur) / 2;
                    int d = (cur - prev) / 2;
                    if (d > bestDist) { bestDist = d; best = cand; }
                }
                prev = cur;
            }
            int last = occ.last();
            if (last != N - 1) {
                int d = N - 1 - last;
                if (d > bestDist) { bestDist = d; best = N - 1; }
            }
            occ.add(best);
            return best;
        }
        void leave(int p) { occ.remove(p); }
    }
    public int[] runExamRoom(String[] operations, int[] values) {
        int N = values[0];
        ExamRoom er = new ExamRoom(N);
        List<Integer> ans = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("seat")) ans.add(er.seat());
            else if (op.equals("leave")) er.leave(values[i]);
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[] values, int[] output) {
        return Arrays.equals(runExamRoom(operations, values), output);
    }
}
