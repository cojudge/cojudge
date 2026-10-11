import java.util.*;
class Marker {
    public List<Integer> powerfulIntegers(int x, int y, int bound) {
        Set<Integer> set = new HashSet<>();
        long px = 1;
        while (px <= bound) {
            long py = 1;
            while (px + py <= bound) {
                set.add((int) (px + py));
                if (y == 1) break;
                py *= y;
            }
            if (x == 1) break;
            px *= x;
        }
        List<Integer> res = new ArrayList<>(set);
        Collections.sort(res);
        return res;
    }
    public boolean isCorrect(int x, int y, int bound, List<Integer> output) {
        if (output == null) return false;
        Set<Integer> exp = new HashSet<>(powerfulIntegers(x, y, bound));
        return exp.equals(new HashSet<>(output));
    }
}
