import java.util.*;
class Marker {
    private int gcd(int a, int b) {
        while (b != 0) {
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }

    public ListNode insertGreatestCommonDivisors(ListNode head) {
        ListNode cur = head;
        while (cur != null && cur.next != null) {
            ListNode gcdNode = new ListNode(gcd(cur.val, cur.next.val));
            gcdNode.next = cur.next;
            cur.next = gcdNode;
            cur = gcdNode.next;
        }
        return head;
    }

    public boolean isCorrect(ListNode head, ListNode output) {
        ListNode expected = insertGreatestCommonDivisors(head);
        while (expected != null && output != null) {
            if (expected.val != output.val) return false;
            expected = expected.next;
            output = output.next;
        }
        return expected == null && output == null;
    }
}