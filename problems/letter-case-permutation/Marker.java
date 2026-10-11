import java.util.*;
class Marker {
    public List<String> letterCasePermutation(String s) {
        List<String> ans = new ArrayList<>();
        build(s.toCharArray(), 0, ans);
        return ans;
    }
    private void build(char[] arr, int i, List<String> ans) {
        if (i == arr.length) {
            ans.add(new String(arr));
            return;
        }
        if (Character.isLetter(arr[i])) {
            arr[i] = Character.toLowerCase(arr[i]);
            build(arr, i + 1, ans);
            arr[i] = Character.toUpperCase(arr[i]);
            build(arr, i + 1, ans);
        } else {
            build(arr, i + 1, ans);
        }
    }
    public boolean isCorrect(String s, List<String> output) {
        if (output == null) return false;
        List<String> expected = letterCasePermutation(s);
        if (output.size() != expected.size()) return false;
        List<String> a = new ArrayList<>(expected);
        List<String> b = new ArrayList<>(output);
        Collections.sort(a);
        Collections.sort(b);
        return a.equals(b);
    }
}
