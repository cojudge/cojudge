import java.util.*;
class Marker {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;
        return merge(sortList(head), sortList(mid));
    }
    private ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0);
        ListNode p = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { p.next = a; a = a.next; }
            else { p.next = b; b = b.next; }
            p = p.next;
        }
        p.next = (a != null) ? a : b;
        return dummy.next;
    }

    private int[] toArray(ListNode head) {
        List<Integer> list = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) list.add(p.val);
        int[] a = new int[list.size()];
        for (int i = 0; i < a.length; i++) a[i] = list.get(i);
        return a;
    }

    public boolean isCorrect(ListNode head, ListNode output) {
        return Arrays.equals(toArray(sortList(head)), toArray(output));
    }
}
