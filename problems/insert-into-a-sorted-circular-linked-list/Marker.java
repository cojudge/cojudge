import java.util.*;
class Marker {
    private static class Node {
        int val; Node next;
        Node(int v) { val = v; }
    }
    public ListNode insert(ListNode head, int insertVal) {
        List<Integer> vals = toArray(head);
        if (vals.isEmpty()) {
            return new ListNode(insertVal);
        }
        int n = vals.size();
        Node[] nodes = new Node[n];
        for (int i = 0; i < n; i++) nodes[i] = new Node(vals.get(i));
        for (int i = 0; i < n; i++) nodes[i].next = nodes[(i + 1) % n];
        Node h = nodes[0];
        Node cur = h;
        Node toInsert = new Node(insertVal);
        // single node
        if (n == 1) {
            cur.next = toInsert;
            toInsert.next = cur;
            return fromVals(new int[]{cur.val, toInsert.val});
        }
        do {
            Node nxt = cur.next;
            if (cur.val <= insertVal && insertVal <= nxt.val) {
                cur.next = toInsert; toInsert.next = nxt;
                return flatten(h, n + 1);
            }
            if (cur.val > nxt.val) {
                if (insertVal >= cur.val || insertVal <= nxt.val) {
                    cur.next = toInsert; toInsert.next = nxt;
                    return flatten(h, n + 1);
                }
            }
            cur = nxt;
        } while (cur != h);
        // all equal fallback: insert after head
        Node nxt = h.next;
        h.next = toInsert; toInsert.next = nxt;
        return flatten(h, n + 1);
    }
    private ListNode flatten(Node h, int len) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        Node p = h;
        for (int i = 0; i < len; i++) {
            cur.next = new ListNode(p.val);
            cur = cur.next;
            p = p.next;
        }
        return dummy.next;
    }
    private ListNode fromVals(int[] a) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        for (int v : a) { cur.next = new ListNode(v); cur = cur.next; }
        return dummy.next;
    }
    private List<Integer> toArray(ListNode head) {
        List<Integer> list = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) list.add(p.val);
        return list;
    }
    private List<Integer> toList(ListNode h) { return toArray(h); }
    public boolean isCorrect(ListNode head, int insertVal, ListNode output) {
        List<Integer> in = toArray(head);
        List<Integer> out = toArray(output);
        if (in.isEmpty()) {
            return out.size() == 1 && out.get(0) == insertVal;
        }
        if (out.size() != in.size() + 1) return false;
        if (!out.get(0).equals(in.get(0))) return false;
        // multiset check
        List<Integer> a = new ArrayList<>(in); a.add(insertVal);
        List<Integer> b = new ArrayList<>(out);
        Collections.sort(a); Collections.sort(b);
        if (!a.equals(b)) return false;
        // circular sorted: at most one drop
        int drops = 0;
        for (int i = 0; i < out.size(); i++) {
            int cur = out.get(i), nxt = out.get((i + 1) % out.size());
            if (cur > nxt) drops++;
        }
        return drops <= 1;
    }
}
