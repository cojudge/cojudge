import java.util.*;
class Marker {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        Deque<Integer> s1 = new ArrayDeque<>();
        Deque<Integer> s2 = new ArrayDeque<>();
        for (ListNode p = l1; p != null; p = p.next) s1.push(p.val);
        for (ListNode p = l2; p != null; p = p.next) s2.push(p.val);
        int carry = 0;
        ListNode head = null;
        while (!s1.isEmpty() || !s2.isEmpty() || carry != 0) {
            int sum = carry;
            if (!s1.isEmpty()) sum += s1.pop();
            if (!s2.isEmpty()) sum += s2.pop();
            ListNode node = new ListNode(sum % 10);
            node.next = head;
            head = node;
            carry = sum / 10;
        }
        return head;
    }
    public boolean isCorrect(ListNode l1, ListNode l2, ListNode output) {
        ListNode expected = addTwoNumbers(l1, l2);
        while (expected != null && output != null) {
            if (expected.val != output.val) return false;
            expected = expected.next;
            output = output.next;
        }
        return expected == null && output == null;
    }
}
