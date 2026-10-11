import java.util.*;
import java.util.regex.Pattern;
class Marker {
    private static final double ABS_TOL = 1e-9;
    private static final double REL_TOL = 1e-5;
    private static final Pattern DECIMAL = Pattern.compile("[+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+))(?:[eE][+-]?\\d+)?");
    public String mincostToHireWorkers(int[] quality, int[] wage, int k) {
        int n = quality.length;
        Integer[] idx = new Integer[n];
        for (int i = 0; i < n; i++) idx[i] = i;
        Arrays.sort(idx, (a, b) -> Double.compare((double) wage[a] / quality[a], (double) wage[b] / quality[b]));
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        long sumQ = 0;
        double best = Double.MAX_VALUE;
        for (int id : idx) {
            maxHeap.offer(quality[id]);
            sumQ += quality[id];
            if (maxHeap.size() > k) sumQ -= maxHeap.poll();
            if (maxHeap.size() == k) {
                double rate = (double) wage[id] / quality[id];
                best = Math.min(best, sumQ * rate);
            }
        }
        return Double.toString(best);
    }
    public boolean isCorrect(int[] quality, int[] wage, int k, String output) {
        if (output == null || !DECIMAL.matcher(output.trim()).matches()) return false;
        try {
            double actual = Double.parseDouble(output.trim());
            double expected = Double.parseDouble(mincostToHireWorkers(quality, wage, k));
            if (!Double.isFinite(actual) || !Double.isFinite(expected)) return false;
            return Math.abs(actual - expected) <= ABS_TOL + REL_TOL * Math.abs(expected);
        } catch (NumberFormatException ex) { return false; }
    }
}
