import java.util.*;
class Marker {
    public int[] runRle(int[] encoding, String[] operations, int[] values) {
        int idx = 0;
        long rem = encoding.length >= 2 ? encoding[0] : 0;
        while (idx < encoding.length && rem == 0) {
            idx += 2;
            if (idx < encoding.length) rem = encoding[idx];
        }
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            long n = values[i];
            int res = -1;
            boolean consumed = false;
            while (n > 0 && idx < encoding.length) {
                if (rem == 0) {
                    idx += 2;
                    if (idx < encoding.length) rem = encoding[idx];
                    continue;
                }
                int v = encoding[idx + 1];
                if (n <= rem) {
                    rem -= n;
                    res = v;
                    consumed = true;
                    n = 0;
                    if (rem == 0) {
                        idx += 2;
                        if (idx < encoding.length) rem = encoding[idx];
                    }
                } else {
                    n -= rem;
                    res = v;
                    consumed = true;
                    idx += 2;
                    if (idx < encoding.length) rem = encoding[idx];
                    else rem = 0;
                }
            }
            if (n > 0) res = -1;
            ans.add(res);
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(int[] encoding, String[] operations, int[] values, int[] output) {
        return output != null && Arrays.equals(runRle(encoding, operations, values), output);
    }
}
