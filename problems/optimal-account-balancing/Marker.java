import java.util.*;
class Marker {
    public int minTransfers(int[][] transactions) {
        Map<Integer, Long> m = new HashMap<>();
        for (int[] t : transactions) {
            m.put(t[0], m.getOrDefault(t[0], 0L) - t[2]);
            m.put(t[1], m.getOrDefault(t[1], 0L) + t[2]);
        }
        List<Long> debts = new ArrayList<>();
        for (long v : m.values()) if (v != 0) debts.add(v);
        return settle(debts, 0);
    }
    private int settle(List<Long> debts, int start) {
        while (start < debts.size() && debts.get(start) == 0) start++;
        if (start == debts.size()) return 0;
        int best = Integer.MAX_VALUE;
        for (int i = start + 1; i < debts.size(); i++) {
            if (debts.get(start) * debts.get(i) < 0) {
                debts.set(i, debts.get(i) + debts.get(start));
                best = Math.min(best, 1 + settle(debts, start + 1));
                debts.set(i, debts.get(i) - debts.get(start));
                if (debts.get(i) + debts.get(start) == 0) break;
            }
        }
        return best;
    }
    public boolean isCorrect(int[][] transactions, int output) {
        return minTransfers(transactions) == output;
    }
}
