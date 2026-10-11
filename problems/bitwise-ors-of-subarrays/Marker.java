import java.util.*;
class Marker {
    public int subarrayBitwiseORs(int[] arr) {
        Set<Integer> all = new HashSet<>();
        Set<Integer> cur = new HashSet<>();
        for (int x : arr) {
            Set<Integer> nxt = new HashSet<>();
            nxt.add(x);
            for (int y : cur) nxt.add(y | x);
            cur = nxt;
            all.addAll(cur);
        }
        return all.size();
    }
    public boolean isCorrect(int[] arr, int output) {
        return subarrayBitwiseORs(arr) == output;
    }
}
