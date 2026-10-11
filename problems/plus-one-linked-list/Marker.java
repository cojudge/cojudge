class Marker {
    public ListNode plusOne(ListNode head) {
        int carry = addOne(head);
        if (carry == 1) {
            ListNode n = new ListNode(1);
            n.next = head;
            return n;
        }
        return head;
    }
    private int addOne(ListNode node) {
        if (node == null) return 1;
        int c = addOne(node.next);
        int s = node.val + c;
        node.val = s % 10;
        return s / 10;
    }
    public boolean isCorrect(ListNode head, ListNode output) {
        ListNode expected = plusOne(copy(head));
        while (expected != null && output != null) {
            if (expected.val != output.val) return false;
            expected = expected.next;
            output = output.next;
        }
        return expected == null && output == null;
    }
    private ListNode copy(ListNode head) {
        ListNode dummy = new ListNode(0);
        ListNode t = dummy;
        for (ListNode p = head; p != null; p = p.next) {
            t.next = new ListNode(p.val);
            t = t.next;
        }
        return dummy.next;
    }
}
