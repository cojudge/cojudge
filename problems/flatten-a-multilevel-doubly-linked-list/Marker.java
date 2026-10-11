import java.util.*;
class Marker {
    public ListNode flatten(ListNode head) {
        if (head == null) return null;
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        ListNode cur = head;
        while (cur != null) {
            tail.next = new ListNode(cur.val);
            tail = tail.next;
            cur = cur.next;
        }
        return dummy.next;
    }
    private List<Integer> vals(ListNode h) {
        List<Integer> res = new ArrayList<>();
        for (ListNode p = h; p != null; p = p.next) res.add(p.val);
        return res;
    }
    public boolean isCorrect(ListNode head, ListNode output) {
        if (head == null) return output == null;
        if (output == null) return false;
        return vals(head).equals(vals(output));
    }
}
