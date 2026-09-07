class Marker {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        for (int i = 1; i < left; i++) prev = prev.next;
        ListNode cur = prev.next;
        for (int i = 0; i < right - left; i++) {
            ListNode nxt = cur.next;
            cur.next = nxt.next;
            nxt.next = prev.next;
            prev.next = nxt;
        }
        return dummy.next;
    }

    private boolean equalsList(ListNode x, ListNode y) {
        while (x != null && y != null) {
            if (x.val != y.val) return false;
            x = x.next; y = y.next;
        }
        return x == null && y == null;
    }

    public boolean isCorrect(ListNode head, int left, int right, ListNode output) {
        ListNode ans = reverseBetween(clone(head), left, right);
        return equalsList(ans, output);
    }

    private ListNode clone(ListNode head) {
        if (head == null) return null;
        ListNode dummy = new ListNode(0);
        ListNode p = dummy;
        for (ListNode q = head; q != null; q = q.next) {
            p.next = new ListNode(q.val);
            p = p.next;
        }
        return dummy.next;
    }
}
