import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        HitCounter obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("HitCounter")) {
                obj = new HitCounter();
                result.add("null");
            } else if (op.equals("hit")) {
                obj.hit(values[i][0]);
                result.add("null");
            } else if (op.equals("getHits")) {
                result.add(String.valueOf(obj.getHits(values[i][0])));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        Deque<Integer> q = new ArrayDeque<>();
        boolean live = false;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String got = output.get(i).trim();
            if (op.equals("HitCounter")) {
                if (!got.equals("null")) return false;
                live = true;
                q.clear();
            } else if (op.equals("hit")) {
                if (!live || !got.equals("null")) return false;
                if (values[i] == null || values[i].length < 1) return false;
                q.offerLast(values[i][0]);
            } else if (op.equals("getHits")) {
                if (!live) return false;
                if (values[i] == null || values[i].length < 1) return false;
                int t = values[i][0];
                while (!q.isEmpty() && q.peekFirst() <= t - 300) q.pollFirst();
                int exp;
                try {
                    exp = Integer.parseInt(got);
                } catch (NumberFormatException e) {
                    return false;
                }
                if (exp != q.size()) return false;
            } else {
                return false;
            }
        }
        return live;
    }

    static class HitCounter {
        private final Deque<Integer> q = new ArrayDeque<>();
        void hit(int timestamp) {
            q.offerLast(timestamp);
        }
        int getHits(int timestamp) {
            while (!q.isEmpty() && q.peekFirst() <= timestamp - 300) q.pollFirst();
            return q.size();
        }
    }
}
