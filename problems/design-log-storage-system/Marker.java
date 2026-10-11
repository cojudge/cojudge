import java.util.*;
class Marker {
    static class Log { int id; String ts; Log(int id, String ts) { this.id = id; this.ts = ts; } }
    private int graIndex(String g) {
        if (g.equals("Year")) return 0;
        if (g.equals("Month")) return 1;
        if (g.equals("Day")) return 2;
        if (g.equals("Hour")) return 3;
        if (g.equals("Minute")) return 4;
        return 5;
    }
    private int[] parts(String ts) {
        String[] p = ts.split(":");
        int[] r = new int[6];
        for (int i = 0; i < 6; i++) r[i] = Integer.parseInt(p[i]);
        return r;
    }
    private int cmpTrunc(int[] a, int[] b, int idx) {
        for (int i = 0; i <= idx; i++) {
            if (a[i] != b[i]) return Integer.compare(a[i], b[i]);
        }
        return 0;
    }
    public int[][] runLogStorage(String[] operations, String[] values) {
        List<Log> logs = new ArrayList<>();
        List<int[]> out = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("LogSystem")) { logs.clear(); }
            else if (op.equals("put")) {
                String v = values[i];
                int p = v.indexOf('|');
                int id = Integer.parseInt(v.substring(0, p));
                logs.add(new Log(id, v.substring(p + 1)));
            } else if (op.equals("retrieve")) {
                String[] seg = values[i].split("\\|", -1);
                int gi = graIndex(seg[2]);
                int[] s = parts(seg[0]), e = parts(seg[1]);
                List<Integer> ids = new ArrayList<>();
                for (Log l : logs) {
                    int[] t = parts(l.ts);
                    if (cmpTrunc(t, s, gi) >= 0 && cmpTrunc(t, e, gi) <= 0) ids.add(l.id);
                }
                out.add(ids.stream().mapToInt(Integer::intValue).toArray());
            }
        }
        return out.toArray(new int[0][]);
    }
    public boolean isCorrect(String[] operations, String[] values, int[][] output) {
        return output != null && Arrays.deepEquals(runLogStorage(operations, values), output);
    }
}
