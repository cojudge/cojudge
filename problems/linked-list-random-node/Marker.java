import java.util.*;
class Marker {
    public int getRandomNode(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) vals.add(p.val);
        return vals.get(0);
    }
    public boolean isCorrect(ListNode head, int output) {
        for (ListNode p = head; p != null; p = p.next) {
            if (p.val == output) return true;
        }
        return false;
    }
}
