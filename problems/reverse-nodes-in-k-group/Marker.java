class Marker {
    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode groupPrevious = dummy;

        while (true) {
            ListNode kth = groupPrevious;
            for (int i = 0; i < k && kth != null; i++) kth = kth.next;
            if (kth == null) return dummy.next;

            ListNode groupNext = kth.next;
            ListNode previous = groupNext;
            ListNode current = groupPrevious.next;
            while (current != groupNext) {
                ListNode next = current.next;
                current.next = previous;
                previous = current;
                current = next;
            }

            ListNode oldStart = groupPrevious.next;
            groupPrevious.next = kth;
            groupPrevious = oldStart;
        }
    }

    public boolean isCorrect(ListNode head, int k, ListNode output) {
        ListNode expected = reverseKGroup(head, k);
        while (expected != null && output != null) {
            if (expected.val != output.val) return false;
            expected = expected.next;
            output = output.next;
        }
        return expected == null && output == null;
    }
}
