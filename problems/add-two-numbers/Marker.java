class Marker {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) {
                sum += l1.val;
                l1 = l1.next;
            }
            if (l2 != null) {
                sum += l2.val;
                l2 = l2.next;
            }
            tail.next = new ListNode(sum % 10);
            tail = tail.next;
            carry = sum / 10;
        }
        return dummy.next;
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
