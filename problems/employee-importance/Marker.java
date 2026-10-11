import java.util.*;
class Marker {
    public int getImportance(int[][] employees, int id) {
        Map<Integer, int[]> byId = new HashMap<>();
        for (int[] row : employees) byId.put(row[0], row);
        int total = 0;
        Deque<Integer> stack = new ArrayDeque<>();
        Set<Integer> seen = new HashSet<>();
        stack.push(id);
        seen.add(id);
        while (!stack.isEmpty()) {
            int cur = stack.pop();
            int[] row = byId.get(cur);
            if (row == null) continue;
            total += row[1];
            for (int i = 2; i < row.length; i++) {
                if (!seen.contains(row[i])) {
                    seen.add(row[i]);
                    stack.push(row[i]);
                }
            }
        }
        return total;
    }
    public boolean isCorrect(int[][] employees, int id, int output) {
        return getImportance(clone(employees), id) == output;
    }
    private int[][] clone(int[][] a) {
        int[][] c = new int[a.length][];
        for (int i = 0; i < a.length; i++) c[i] = a[i].clone();
        return c;
    }
}
