import java.util.*;
class Marker {
    public ListNode[] splitListToParts(ListNode head, int k) {
        int n = 0;
        for (ListNode p = head; p != null; p = p.next) n++;
        int base = n / k, extra = n % k;
        ListNode[] ans = new ListNode[k];
        ListNode cur = head;
        for (int i = 0; i < k; i++) {
            int size = base + (i < extra ? 1 : 0);
            if (size == 0) { ans[i] = null; continue; }
            ans[i] = cur;
            for (int j = 1; j < size; j++) cur = cur.next;
            ListNode nxt = cur.next;
            cur.next = null;
            cur = nxt;
        }
        return ans;
    }
    private List<Integer> vals(ListNode h) {
        List<Integer> r = new ArrayList<>();
        for (ListNode p = h; p != null; p = p.next) r.add(p.val);
        return r;
    }
    public boolean isCorrect(ListNode head, int k, ListNode[] output) {
        if (output == null || output.length != k) return false;
        int n = 0;
        for (ListNode p = head; p != null; p = p.next) n++;
        int base = n / k, extra = n % k;
        ListNode cur = head;
        for (int i = 0; i < k; i++) {
            int size = base + (i < extra ? 1 : 0);
            List<Integer> want = new ArrayList<>();
            for (int j = 0; j < size; j++) { want.add(cur.val); cur = cur.next; }
            if (!want.equals(vals(output[i]))) return false;
        }
        return cur == null;
    }
}
