class Marker {
    public ListNode reorderList(ListNode head) {
        if (head == null || head.next == null) return head;

        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        ListNode prev = null, cur = slow;
        while (cur != null) {
            ListNode nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }

        ListNode first = head, second = prev;
        while (second.next != null) {
            ListNode tmp1 = first.next;
            ListNode tmp2 = second.next;
            first.next = second;
            second.next = tmp1;
            first = tmp1;
            second = tmp2;
        }

        return head;
    }

    private boolean equalsList(ListNode a, ListNode b) {
        while (a != null && b != null) {
            if (a.val != b.val) return false;
            a = a.next;
            b = b.next;
        }
        return a == null && b == null;
    }

    public boolean isCorrect(ListNode head, ListNode output) {
        ListNode expected = reorderList(head);
        return equalsList(expected, output);
    }
}
