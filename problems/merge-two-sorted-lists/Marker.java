class Marker {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0), tail = dummy;
        ListNode a = list1, b = list2;
        while (a != null && b != null) {
            if (a.val <= b.val) { tail.next = a; a = a.next; }
            else { tail.next = b; b = b.next; }
            tail = tail.next;
        }
        tail.next = (a != null) ? a : b;
        return dummy.next;
    }

    private boolean equalsList(ListNode x, ListNode y) {
        while (x != null && y != null) {
            if (x.val != y.val) return false;
            x = x.next; y = y.next;
        }
        return x == null && y == null;
    }

    public boolean isCorrect(ListNode list1, ListNode list2, ListNode output) {
        ListNode ans = mergeTwoLists(list1, list2);
        return equalsList(ans, output);
    }
}
