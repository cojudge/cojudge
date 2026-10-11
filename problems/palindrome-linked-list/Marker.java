import java.util.*;
class Marker {
    public boolean isPalindrome(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
        int i = 0, j = vals.size() - 1;
        while (i < j) {
            if (!vals.get(i).equals(vals.get(j))) return false;
            i++;
            j--;
        }
        return true;
    }

    public boolean isCorrect(ListNode head, boolean output) {
        return output == isPalindrome(head);
    }
}
