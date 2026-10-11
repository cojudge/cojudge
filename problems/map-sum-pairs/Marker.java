import java.util.*;
class Marker {
    public int[] runMapSum(String[] operations, String[] keys, int[] vals) {
        Map<String,Integer> map = new HashMap<>();
        List<Integer> ans = new ArrayList<>();
        for (int i = 0; i < operations.length; i++) {
            if (operations[i].equals("insert")) {
                map.put(keys[i], vals[i]);
            } else if (operations[i].equals("sum")) {
                String pre = keys[i];
                int s = 0;
                for (Map.Entry<String,Integer> e : map.entrySet()) {
                    if (e.getKey().startsWith(pre)) s += e.getValue();
                }
                ans.add(s);
            }
        }
        return ans.stream().mapToInt(Integer::intValue).toArray();
    }
    public boolean isCorrect(String[] operations, String[] keys, int[] vals, int[] output) {
        return Arrays.equals(runMapSum(operations, keys, vals), output);
    }
}
