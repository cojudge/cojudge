import java.util.*;
class Marker {
    public int[] zigzagIterate(int[] v1, int[] v2) {
        List<Integer> res = new ArrayList<>();
        int i = 0, j = 0;
        boolean takeFirst = true;
        while (i < v1.length || j < v2.length) {
            if (takeFirst) {
                if (i < v1.length) res.add(v1[i++]);
                else res.add(v2[j++]);
            } else {
                if (j < v2.length) res.add(v2[j++]);
                else res.add(v1[i++]);
            }
            takeFirst = !takeFirst;
        }
        return res.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(int[] v1, int[] v2, int[] output) {
        return Arrays.equals(zigzagIterate(v1, v2), output);
    }
}
