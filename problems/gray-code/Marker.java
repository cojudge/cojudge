import java.util.*;
class Marker {
    public List<Integer> grayCode(int n) {
        int total = 1 << n;
        List<Integer> res = new ArrayList<>(total);
        for (int i = 0; i < total; i++) {
            res.add(i ^ (i >> 1));
        }
        return res;
    }
    public boolean isCorrect(int n, List<Integer> output) {
        if (output == null) return false;
        int total = 1 << n;
        if (output.size() != total) return false;
        if (output.get(0) != 0) return false;
        Set<Integer> seen = new HashSet<>(output);
        if (seen.size() != total) return false;
        for (int v : output) {
            if (v < 0 || v >= total) return false;
        }
        for (int i = 1; i < output.size(); i++) {
            int diff = output.get(i) ^ output.get(i - 1);
            if (Integer.bitCount(diff) != 1) return false;
        }
        return true;
    }
}
