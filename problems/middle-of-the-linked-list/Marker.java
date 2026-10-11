class Marker {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
    public boolean isCorrect(ListNode head, ListNode output) {
        ListNode expected = middleNode(head);
        while (expected != null && output != null) {
            if (expected.val != output.val) return false;
            expected = expected.next;
            output = output.next;
        }
        return expected == null && output == null;
    }
}
