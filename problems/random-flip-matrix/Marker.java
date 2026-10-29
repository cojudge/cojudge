import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        FlipMatrix obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("FlipMatrix")) {
                obj = new FlipMatrix(values[i][0], values[i][1]);
                result.add("null");
            } else if (op.equals("flip")) {
                int[] c = obj.flip();
                result.add("[" + c[0] + "," + c[1] + "]");
            } else if (op.equals("reset")) {
                obj.reset();
                result.add("null");
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        int m = -1, n = -1;
        boolean live = false;
        Set<Integer> seen = new HashSet<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String got = output.get(i).trim();
            if (op.equals("FlipMatrix")) {
                if (!got.equals("null")) return false;
                if (values[i] == null || values[i].length < 2) return false;
                m = values[i][0];
                n = values[i][1];
                if (m < 1 || n < 1) return false;
                live = true;
                seen.clear();
            } else if (op.equals("flip")) {
                if (!live) return false;
                int[] c = parseCell(got);
                if (c == null) return false;
                if (c[0] < 0 || c[0] >= m || c[1] < 0 || c[1] >= n) return false;
                if (!seen.add(c[0] * n + c[1])) return false;
            } else if (op.equals("reset")) {
                if (!live || !got.equals("null")) return false;
                seen.clear();
            } else {
                return false;
            }
        }
        return live;
    }

    private int[] parseCell(String s) {
        if (s == null) return null;
        s = s.trim();
        if (!s.startsWith("[") || !s.endsWith("]")) return null;
        String[] parts = s.substring(1, s.length() - 1).split(",");
        if (parts.length != 2) return null;
        try {
            return new int[]{Integer.parseInt(parts[0].trim()), Integer.parseInt(parts[1].trim())};
        } catch (NumberFormatException e) {
            return null;
        }
    }

    static class FlipMatrix {
        private final int m, n;
        private int next;
        FlipMatrix(int m, int n) {
            this.m = m;
            this.n = n;
            this.next = 0;
        }
        int[] flip() {
            int k = next++;
            return new int[]{k / n, k % n};
        }
        void reset() {
            next = 0;
        }
    }
}
