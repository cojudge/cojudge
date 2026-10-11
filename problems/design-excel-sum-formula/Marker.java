import java.util.*;
class Marker {
    public int[] runExcel(String[] operations, List<List<String>> args) {
        Excel ex = null;
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            List<String> a = args.get(i);
            if (op.equals("Excel")) {
                ex = new Excel(Integer.parseInt(a.get(0)), Integer.parseInt(a.get(1)));
            } else if (op.equals("set")) {
                ex.set(Integer.parseInt(a.get(0)), Integer.parseInt(a.get(1)), Integer.parseInt(a.get(2)));
            } else if (op.equals("get")) {
                out.add(ex.get(Integer.parseInt(a.get(0)), Integer.parseInt(a.get(1))));
            } else if (op.equals("sum")) {
                int r = Integer.parseInt(a.get(0)), c = Integer.parseInt(a.get(1));
                String[] toks = a.subList(2, a.size()).toArray(new String[0]);
                out.add(ex.sum(r, c, toks));
            }
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, List<List<String>> args, int[] output) {
        return Arrays.equals(runExcel(operations, args), output);
    }
    static class Excel {
        int H, W;
        int[][] vals;
        Map<String, List<String>> formulas = new HashMap<>();
        Excel(int h, int w) { H = h; W = w; vals = new int[H + 1][W + 1]; }
        void set(int r, int c, int v) { formulas.remove(r + "," + c); vals[r][c] = v; }
        int get(int r, int c) {
            String key = r + "," + c;
            if (!formulas.containsKey(key)) return vals[r][c];
            int s = 0;
            for (String t : formulas.get(key)) s += evalToken(t);
            return s;
        }
        int sum(int r, int c, String[] strs) {
            formulas.put(r + "," + c, new ArrayList<>(Arrays.asList(strs)));
            return get(r, c);
        }
        int evalToken(String t) {
            if (t.contains(":")) {
                String[] parts = t.split(":");
                int[] p1 = parse(parts[0]), p2 = parse(parts[1]);
                int s = 0;
                for (int r = Math.min(p1[0], p2[0]); r <= Math.max(p1[0], p2[0]); r++)
                    for (int c = Math.min(p1[1], p2[1]); c <= Math.max(p1[1], p2[1]); c++)
                        s += get(r, c);
                return s;
            }
            int[] p = parse(t);
            return get(p[0], p[1]);
        }
        int[] parse(String cell) {
            int i = 0;
            while (i < cell.length() && Character.isLetter(cell.charAt(i))) i++;
            String colS = cell.substring(0, i), rowS = cell.substring(i);
            int c = 0;
            for (char ch : colS.toCharArray()) c = c * 26 + (Character.toUpperCase(ch) - 'A' + 1);
            int r = Integer.parseInt(rowS);
            return new int[]{r, c};
        }
    }
}
