import java.util.*;
class Marker {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, cur = head;
        while (cur != null) {
            ListNode nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }
        return prev;
    }

    private int[] toArray(ListNode head) {
        List<Integer> list = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) list.add(p.val);
        int[] a = new int[list.size()];
        for (int i = 0; i < a.length; i++) a[i] = list.get(i);
        return a;
    }

    public boolean isCorrect(ListNode head, ListNode output) {
        int[] in = toArray(head);
        int[] out = toArray(output);
        if (in.length != out.length) return false;
        for (int i = 0; i < in.length; i++) {
            if (in[i] != out[out.length - 1 - i]) return false;
        }
        return true;
    }
}
