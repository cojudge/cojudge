import java.util.*;
class Marker {
    public List<String> generatePalindromes(String s) {
        Map<Character, Integer> freq = new TreeMap<>();
        for (char c : s.toCharArray()) freq.put(c, freq.getOrDefault(c, 0) + 1);
        String mid = "";
        List<Character> halfList = new ArrayList<>();
        for (Map.Entry<Character, Integer> e : freq.entrySet()) {
            int cnt = e.getValue();
            if (cnt % 2 == 1) {
                if (!mid.isEmpty()) return new ArrayList<>();
                mid = String.valueOf(e.getKey());
            }
            for (int j = 0; j < cnt / 2; j++) halfList.add(e.getKey());
        }
        char[] arr = new char[halfList.size()];
        for (int i = 0; i < arr.length; i++) arr[i] = halfList.get(i);
        List<String> result = new ArrayList<>();
        permute(arr, new boolean[arr.length], new StringBuilder(), mid, result);
        return result;
    }
    private void permute(char[] arr, boolean[] used, StringBuilder cur, String mid, List<String> result) {
        if (cur.length() == arr.length) {
            String h = cur.toString();
            result.add(h + mid + new StringBuilder(h).reverse().toString());
            return;
        }
        for (int i = 0; i < arr.length; i++) {
            if (used[i]) continue;
            if (i > 0 && arr[i] == arr[i - 1] && !used[i - 1]) continue;
            used[i] = true;
            cur.append(arr[i]);
            permute(arr, used, cur, mid, result);
            cur.deleteCharAt(cur.length() - 1);
            used[i] = false;
        }
    }
    public boolean isCorrect(String s, List<String> output) {
        if (output == null || output.stream().anyMatch(Objects::isNull)) return false;
        List<String> expected = generatePalindromes(s);
        List<String> a = new ArrayList<>(expected);
        List<String> b = new ArrayList<>(output);
        Collections.sort(a);
        Collections.sort(b);
        return a.equals(b);
    }
}
