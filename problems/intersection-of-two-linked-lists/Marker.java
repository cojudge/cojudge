import java.util.*;
class Marker {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        List<Integer> a = toList(headA);
        List<Integer> b = toList(headB);
        int i = a.size() - 1, j = b.size() - 1;
        int match = 0;
        while (i >= 0 && j >= 0 && a.get(i).equals(b.get(j))) {
            match++;
            i--;
            j--;
        }
        if (match == 0) return null;
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        int start = a.size() - match;
        for (int k = start; k < a.size(); k++) {
            cur.next = new ListNode(a.get(k));
            cur = cur.next;
        }
        return dummy.next;
    }
    private List<Integer> toList(ListNode h) {
        List<Integer> r = new ArrayList<>();
        while (h != null) { r.add(h.val); h = h.next; }
        return r;
    }
    private boolean equalsList(ListNode x, ListNode y) {
        while (x != null && y != null) {
            if (x.val != y.val) return false;
            x = x.next; y = y.next;
        }
        return x == null && y == null;
    }
    public boolean isCorrect(ListNode headA, ListNode headB, ListNode output) {
        ListNode ans = getIntersectionNode(headA, headB);
        return equalsList(ans, output);
    }
}
