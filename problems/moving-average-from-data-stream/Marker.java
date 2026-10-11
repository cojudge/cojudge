import java.util.*;
class Marker {
    public List<String> runMovingAverage(String[] operations, int[][] args) {
        int size = args[0][0];
        Deque<Integer> q = new ArrayDeque<>();
        long sum = 0;
        List<String> out = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            if (operations[i].equals("next")) {
                int v = args[i][0];
                q.addLast(v);
                sum += v;
                if (q.size() > size) sum -= q.removeFirst();
                out.add(Double.toString(sum / (double) q.size()));
            }
        }
        return out;
    }
    public boolean isCorrect(String[] operations, int[][] args, List<String> output) {
        List<String> expected = runMovingAverage(operations, args);
        if (output == null || output.size() != expected.size()) return false;
        for (int i = 0; i < expected.size(); i++) {
            try {
                double e = Double.parseDouble(expected.get(i));
                double a = Double.parseDouble(output.get(i));
                double tol = 1e-9 + 1e-6 * Math.abs(e);
                if (Math.abs(e - a) > tol) return false;
            } catch (Exception ex) { return false; }
        }
        return true;
    }
}
