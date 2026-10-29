You are given a list `nums` and a window length `k`. Choose three blocks, each covering exactly `k` consecutive positions, so that no two blocks overlap. The goal is to make the sum of all covered entries as large as possible.

Return the three starting indexes in increasing order. When several triples reach the same best total, return the one that is smallest in dictionary order (compare the first differing index).

**Constraints:**
- `3 * k <= nums.length <= 20000`
- `1 <= k <= 250`
- `1 <= nums[i] <= 1000`
- The judge accepts any triple whose total equals the optimum and whose blocks are disjoint and ordered; the reference returns the dictionary-smallest.
