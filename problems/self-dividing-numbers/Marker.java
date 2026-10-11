import java.util.*;
class Marker {
    public List<Integer> selfDividingNumbers(int left, int right) {
        List<Integer> ans = new ArrayList<>();
        for (int x = left; x <= right; x++) {
            if (ok(x)) ans.add(x);
        }
        return ans;
    }
    private boolean ok(int x) {
        int t = x;
        while (t > 0) {
            int d = t % 10;
            if (d == 0 || x % d != 0) return false;
            t /= 10;
        }
        return true;
    }
    public boolean isCorrect(int left, int right, List<Integer> output) {
        if (output == null) return false;
        return selfDividingNumbers(left, right).equals(output);
    }
}
