import java.util.*;
class Marker {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        PriorityQueue<ListNode> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a.val));
        for (ListNode node : lists) if (node != null) pq.offer(node);
        ListNode dummy = new ListNode(0), tail = dummy;
        while (!pq.isEmpty()) {
            ListNode cur = pq.poll();
            tail.next = cur; tail = tail.next;
            if (cur.next != null) pq.offer(cur.next);
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

    public boolean isCorrect(ListNode[] lists, ListNode output) {
        ListNode ans = mergeKLists(lists);
        return equalsList(ans, output);
    }
}
