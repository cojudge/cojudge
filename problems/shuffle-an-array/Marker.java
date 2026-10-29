import java.util.*;
class Marker {
    public List<String> solve(String[] operations, int[][] values) {
        List<String> result = new ArrayList<>();
        Shuffler obj = null;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("Shuffler")) {
                obj = new Shuffler(values[i]);
                result.add("null");
            } else if (op.equals("shuffle")) {
                result.add(arrayToString(obj.shuffle()));
            } else if (op.equals("reset")) {
                result.add(arrayToString(obj.reset()));
            }
        }
        return result;
    }

    public boolean isCorrect(String[] operations, int[][] values, List<String> output) {
        if (operations == null || values == null || output == null) return false;
        if (values.length != operations.length || output.size() != operations.length) return false;
        int[] original = null;
        boolean live = false;
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            String got = output.get(i).trim();
            if (op.equals("Shuffler")) {
                if (!got.equals("null") || values[i] == null) return false;
                original = values[i].clone();
                live = true;
            } else if (op.equals("shuffle")) {
                if (!live) return false;
                int[] a = parseArray(got);
                if (a == null || !sameMultiset(a, original)) return false;
            } else if (op.equals("reset")) {
                if (!live) return false;
                int[] a = parseArray(got);
                if (a == null || !Arrays.equals(a, original)) return false;
            } else {
                return false;
            }
        }
        return live;
    }

    private static String arrayToString(int[] a) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int j = 0; j < a.length; j++) {
            if (j > 0) sb.append(",");
            sb.append(a[j]);
        }
        sb.append("]");
        return sb.toString();
    }

    private int[] parseArray(String s) {
        if (s == null) return null;
        s = s.trim();
        if (!s.startsWith("[") || !s.endsWith("]")) return null;
        String inner = s.substring(1, s.length() - 1).trim();
        if (inner.isEmpty()) return new int[0];
        String[] parts = inner.split(",");
        int[] res = new int[parts.length];
        try {
            for (int j = 0; j < parts.length; j++) res[j] = Integer.parseInt(parts[j].trim());
        } catch (NumberFormatException e) {
            return null;
        }
        return res;
    }

    private boolean sameMultiset(int[] a, int[] b) {
        if (a == null || b == null || a.length != b.length) return false;
        Map<Integer, Integer> count = new HashMap<>();
        for (int v : a) count.put(v, count.getOrDefault(v, 0) + 1);
        for (int v : b) {
            Integer c = count.get(v);
            if (c == null || c == 0) return false;
            count.put(v, c - 1);
        }
        return true;
    }

    static class Shuffler {
        private final int[] original;
        private int[] arr;
        private final Random rand = new Random();
        Shuffler(int[] nums) {
            this.original = nums.clone();
            this.arr = nums.clone();
        }
        int[] shuffle() {
            for (int i = arr.length - 1; i > 0; i--) {
                int j = rand.nextInt(i + 1);
                int t = arr[i];
                arr[i] = arr[j];
                arr[j] = t;
            }
            return arr.clone();
        }
        int[] reset() {
            arr = original.clone();
            return arr.clone();
        }
    }
}
