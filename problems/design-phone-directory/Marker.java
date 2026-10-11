import java.util.*;
class Marker {
    public int[] runPhoneDirectory(String[] operations, int[][] args) {
        int maxN = args[0][0];
        boolean[] taken = new boolean[maxN];
        List<Integer> out = new ArrayList<>();
        for (int i = 1; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("get")) {
                int idx = -1;
                for (int j = 0; j < maxN; j++) {
                    if (!taken[j]) { idx = j; break; }
                }
                if (idx != -1) taken[idx] = true;
                out.add(idx);
            } else if (op.equals("check")) {
                int num = args[i][0];
                out.add(!taken[num] ? 1 : 0);
            } else if (op.equals("release")) {
                int num = args[i][0];
                if (taken[num]) taken[num] = false;
            }
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return output != null && Arrays.equals(runPhoneDirectory(operations, args), output);
    }
}
