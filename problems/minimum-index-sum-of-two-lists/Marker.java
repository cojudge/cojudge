import java.util.*;
class Marker {
    public List<String> findRestaurant(String[] list1, String[] list2) {
        Map<String,Integer> idx = new HashMap<>();
        for (int i = 0; i < list2.length; i++) idx.put(list2[i], i);
        List<String> ans = new ArrayList<>();
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < list1.length; i++) {
            Integer j = idx.get(list1[i]);
            if (j != null) {
                int s = i + j;
                if (s < best) { best = s; ans.clear(); ans.add(list1[i]); }
                else if (s == best) ans.add(list1[i]);
            }
        }
        return ans;
    }
    public boolean isCorrect(String[] list1, String[] list2, List<String> output) {
        if (output == null) return false;
        List<String> exp = findRestaurant(list1, list2);
        if (exp.size() != output.size()) return false;
        List<String> a = new ArrayList<>(exp), b = new ArrayList<>(output);
        Collections.sort(a); Collections.sort(b);
        return a.equals(b);
    }
}
