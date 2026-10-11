class Marker {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null || k == 0) return head;
        int len = 1;
        ListNode tail = head;
        while (tail.next != null) {
            tail = tail.next;
            len++;
        }
        k %= len;
        if (k == 0) return head;
        tail.next = head;
        ListNode newTail = head;
        for (int i = 0; i < len - k - 1; i++) newTail = newTail.next;
        ListNode newHead = newTail.next;
        newTail.next = null;
        return newHead;
    }
    private boolean equalsList(ListNode x, ListNode y) {
        while (x != null && y != null) {
            if (x.val != y.val) return false;
            x = x.next;
            y = y.next;
        }
        return x == null && y == null;
    }
    public boolean isCorrect(ListNode head, int k, ListNode output) {
        return equalsList(rotateRight(head, k), output);
    }
}
