import java.util.*;
class Marker {
    static class TrieNode {
        TrieNode[] next = new TrieNode[2];
    }
    public int findMaximumXOR(int[] nums) {
        TrieNode root = new TrieNode();
        for (int v : nums) {
            TrieNode cur = root;
            for (int b = 30; b >= 0; b--) {
                int bit = (v >>> b) & 1;
                if (cur.next[bit] == null) cur.next[bit] = new TrieNode();
                cur = cur.next[bit];
            }
        }
        int best = 0;
        for (int v : nums) {
            TrieNode cur = root;
            int curXor = 0;
            for (int b = 30; b >= 0; b--) {
                int bit = (v >>> b) & 1;
                int want = bit ^ 1;
                if (cur.next[want] != null) {
                    curXor |= (1 << b);
                    cur = cur.next[want];
                } else {
                    cur = cur.next[bit];
                }
            }
            best = Math.max(best, curXor);
        }
        return best;
    }
    public boolean isCorrect(int[] nums, int output) {
        return output == findMaximumXOR(nums);
    }
}
