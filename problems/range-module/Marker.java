import java.util.*;
class Marker {
    public int[] runRangeModule(String[] operations, int[][] args) {
        TreeMap<Integer, Integer> map = new TreeMap<>();
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            String op = operations[i];
            if (op.equals("RangeModule")) continue;
            int l = args[i][0], r = args[i][1];
            if (op.equals("addRange")) addRange(map, l, r);
            else if (op.equals("removeRange")) removeRange(map, l, r);
            else if (op.equals("queryRange")) ans.add(queryRange(map, l, r) ? 1 : 0);
            else throw new IllegalArgumentException("Unknown op " + op);
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    private void addRange(TreeMap<Integer, Integer> map, int left, int right) {
        if (left >= right) return;
        Integer start = map.floorKey(left);
        if (start != null && map.get(start) >= left) left = Math.min(left, start);
        Integer key = map.ceilingKey(left);
        while (key != null && key <= right) {
            right = Math.max(right, map.get(key));
            map.remove(key);
            key = map.ceilingKey(left);
        }
        if (start != null && map.containsKey(start) && map.get(start) >= left) {
            right = Math.max(right, map.get(start));
            map.remove(start);
        }
        map.put(left, right);
    }
    private boolean queryRange(TreeMap<Integer, Integer> map, int left, int right) {
        Map.Entry<Integer, Integer> e = map.floorEntry(left);
        return e != null && e.getValue() >= right;
    }
    private void removeRange(TreeMap<Integer, Integer> map, int left, int right) {
        if (left >= right) return;
        Integer start = map.floorKey(left);
        List<Integer> toRemove = new ArrayList<>();
        List<int[]> toAdd = new ArrayList<>();
        if (start != null && map.get(start) > left) {
            int s = start, e = map.get(start);
            toRemove.add(s);
            if (s < left) toAdd.add(new int[]{s, left});
            if (e > right) toAdd.add(new int[]{right, e});
        }
        Integer key = map.ceilingKey(left);
        while (key != null && key < right) {
            int e = map.get(key);
            toRemove.add(key);
            if (e > right) toAdd.add(new int[]{right, e});
            key = map.higherKey(key);
        }
        for (int k : toRemove) map.remove(k);
        for (int[] iv : toAdd) map.put(iv[0], iv[1]);
    }
    public boolean isCorrect(String[] operations, int[][] args, int[] output) {
        return output != null && Arrays.equals(runRangeModule(operations, args), output);
    }
}
