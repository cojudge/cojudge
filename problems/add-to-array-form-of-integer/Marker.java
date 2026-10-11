import java.util.*;
class Marker {
    public List<Integer> addToArrayForm(int[] num, int k) {
        List<Integer> ans = new ArrayList<>();
        int i = num.length - 1;
        int carry = k;
        while (i >= 0 || carry > 0) {
            if (i >= 0) {
                carry += num[i];
                i--;
            }
            ans.add(carry % 10);
            carry /= 10;
        }
        Collections.reverse(ans);
        return ans;
    }
    public boolean isCorrect(int[] num, int k, List<Integer> output) {
        return addToArrayForm(num, k).equals(output);
    }
}
