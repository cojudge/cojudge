class Marker {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i < n; i++) fast = fast.next;
        while (fast != null && fast.next != null) {
            fast = fast.next;
            slow = slow.next;
        }
        if (slow.next != null) slow.next = slow.next.next;
        return dummy.next;
    }

    private boolean equalsList(ListNode x, ListNode y) {
        while (x != null && y != null) {
            if (x.val != y.val) return false;
            x = x.next; y = y.next;
        }
        return x == null && y == null;
    }

    public boolean isCorrect(ListNode head, int n, ListNode output) {
        ListNode ans = removeNthFromEnd(head, n);
        return equalsList(ans, output);
    }
}
