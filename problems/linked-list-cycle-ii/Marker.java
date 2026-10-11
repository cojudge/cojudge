import java.util.*;
class Marker {
    public int detectCycle(ListNode head) {
        if (head == null) return -1;
        ListNode slow = head, fast = head;
        boolean hasCycle = false;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) { hasCycle = true; break; }
        }
        if (!hasCycle) return -1;
        ListNode entry = head;
        while (entry != slow) {
            entry = entry.next;
            slow = slow.next;
        }
        int idx = 0;
        for (ListNode p = head; p != entry; p = p.next) idx++;
        return idx;
    }

    public boolean isCorrect(ListNode head, int output) {
        return detectCycle(head) == output;
    }
}
