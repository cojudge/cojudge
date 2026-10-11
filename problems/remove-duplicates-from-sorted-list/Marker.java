class Marker {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode cur = head;
        while (cur != null && cur.next != null) {
            if (cur.val == cur.next.val) {
                cur.next = cur.next.next;
            } else {
                cur = cur.next;
            }
        }
        return head;
    }
    private boolean equalsList(ListNode x, ListNode y) {
        while (x != null && y != null) {
            if (x.val != y.val) return false;
            x = x.next;
            y = y.next;
        }
        return x == null && y == null;
    }
    public boolean isCorrect(ListNode head, ListNode output) {
        return equalsList(deleteDuplicates(head), output);
    }
}
