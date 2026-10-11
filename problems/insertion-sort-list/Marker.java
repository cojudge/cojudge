import java.util.*;
class Marker {
    public ListNode insertionSortList(ListNode head) {
        ListNode dummy = new ListNode(0);
        ListNode cur = head;
        while (cur != null) {
            ListNode nxt = cur.next;
            ListNode p = dummy;
            while (p.next != null && p.next.val < cur.val) p = p.next;
            cur.next = p.next;
            p.next = cur;
            cur = nxt;
        }
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
        int[] sorted = toArray(insertionSortList(head));
        int[] out = toArray(output);
        return Arrays.equals(sorted, out);
    }
}
