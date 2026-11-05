import java.util.*;

class Marker {
    // A single valid pick is not enough to tell a random solution from one that
    // always returns the first match. Once a trace has enough calls, require
    // every valid index to appear and reject obviously degenerate patterns.
    private static final int MIN_RANDOM_PICKS = 120;
    private static final int MAX_STAT_CANDIDATES = 6;

    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        RandomPickIndex obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("RandomPickIndex")) {
                obj = new RandomPickIndex(values[i]);
                result.add("null");
            } else if (op.equals("pick")) {
                result.add(String.valueOf(obj.pick(values[i][0])));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (operations.length != values.length || output.size() != operations.length) return false;

        int[] nums = null;
        Map<Integer, List<Integer>> picksByTarget = new HashMap<>();

        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String got = output.get(i);
            if (op == null) return false;

            if (op.equals("RandomPickIndex")) {
                if (got == null || !got.trim().equals("null")) return false;
                if (values[i] == null || values[i].length == 0) return false;
                nums = values[i].clone();
                picksByTarget.clear();
            } else if (op.equals("pick")) {
                if (nums == null || values[i] == null || values[i].length != 1) return false;
                int idx;
                try {
                    idx = Integer.parseInt(got == null ? "" : got.trim());
                } catch (NumberFormatException e) {
                    return false;
                }
                int target = values[i][0];
                if (idx < 0 || idx >= nums.length || nums[idx] != target) return false;
                picksByTarget.computeIfAbsent(target, k -> new ArrayList<>()).add(idx);
            } else {
                return false;
            }
        }

        if (nums == null) return false;
        for (Map.Entry<Integer, List<Integer>> entry : picksByTarget.entrySet()) {
            if (!distributionLooksRandom(nums, entry.getKey(), entry.getValue())) return false;
        }
        return true;
    }

    private boolean distributionLooksRandom(int[] nums, int target, List<Integer> picks) {
        int candidates = 0;
        for (int value : nums) {
            if (value == target) candidates++;
        }
        if (candidates <= 1) return true;

        // Short sample traces only check that each returned index is valid.
        if (picks.size() < MIN_RANDOM_PICKS) return true;
        if (hasShortCycle(picks)) return false;

        Map<Integer, Integer> counts = new HashMap<>();
        for (int idx : picks) counts.merge(idx, 1, Integer::sum);

        // A solution that always returns the first match, or picks from only a
        // subset of the valid indexes, fails this coverage check.
        if (counts.size() != candidates) return false;

        if (candidates <= MAX_STAT_CANDIDATES) {
            double expected = picks.size() / (double) candidates;
            int lower = Math.max(1, (int) Math.floor(expected / 10.0));
            int upper = (int) Math.ceil(expected * 2.5);
            for (int count : counts.values()) {
                if (count < lower || count > upper) return false;
            }
        }
        return true;
    }

    // Deterministic round-robin implementations pass a coverage check but are
    // not random. A genuine random sequence never repeats a short period for
    // this many calls except with negligible probability.
    private boolean hasShortCycle(List<Integer> picks) {
        int n = picks.size();
        int maxPeriod = Math.min(32, n / 3);
        for (int period = 1; period <= maxPeriod; period++) {
            boolean periodic = true;
            for (int i = period; i < n; i++) {
                if (!picks.get(i).equals(picks.get(i - period))) {
                    periodic = false;
                    break;
                }
            }
            if (periodic) return true;
        }
        return false;
    }

    static class RandomPickIndex {
        private final int[] nums;
        private final Random random = new Random();

        RandomPickIndex(int[] nums) {
            this.nums = nums.clone();
        }

        int pick(int target) {
            int seen = 0;
            int chosen = -1;
            for (int i = 0; i < nums.length; i++) {
                if (nums[i] != target) continue;
                seen++;
                if (random.nextInt(seen) == 0) chosen = i;
            }
            return chosen;
        }
    }
}
