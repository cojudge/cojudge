import java.util.*;
class Marker {
    public ListNode deleteNode(ListNode head, int val) {
        ListNode cur = head;
        while (cur != null && cur.val != val) cur = cur.next;
        if (cur != null && cur.next != null) {
            cur.val = cur.next.val;
            cur.next = cur.next.next;
        }
        return head;
    }

    private int[] toArray(ListNode head) {
        List<Integer> list = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) list.add(p.val);
        int[] a = new int[list.size()];
        for (int i = 0; i < a.length; i++) a[i] = list.get(i);
        return a;
    }

    public boolean isCorrect(ListNode head, int val, ListNode output) {
        return Arrays.equals(toArray(deleteNode(head, val)), toArray(output));
    }
}
