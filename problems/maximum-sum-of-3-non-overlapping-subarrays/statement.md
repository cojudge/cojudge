You are given a list `nums` and a window length `k`. Choose three blocks, each covering exactly `k` consecutive positions, so that no two blocks overlap. The goal is to make the sum of all covered entries as large as possible.

Return the three starting indexes in increasing order. When several triples reach the same best total, return the one that is smallest in dictionary order (compare the first differing index).

**Example 1:**
```
Input: nums = [1,2,1,2,6,7,5,1], k = 2
Output: [0,3,5]
Explanation: Blocks [1,2], [2,6] and [7,5] sum to 3 + 8 + 12 = 23, which is optimal.
```

**Example 2:**
```
Input: nums = [1,2,1,2,1,2,1,2,1], k = 2
Output: [0,2,4]
Explanation: Every length-2 block sums to 3, so the earliest triple wins.
```

**Example 3:**
```
Input: nums = [4,5,10,6,11,17,4,8,1,20], k = 1
Output: [4,5,9]
Explanation: Picking single spots 11, 17 and 20 gives the largest total 48.
```

**Constraints:**
- `3 * k <= nums.length <= 20000`
- `1 <= k <= 250`
- `1 <= nums[i] <= 1000`
- The judge accepts any triple whose total equals the optimum and whose blocks are disjoint and ordered; the reference returns the dictionary-smallest.
