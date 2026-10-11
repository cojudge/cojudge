You are handed the root of a binary search tree, where every left descendant
is smaller than its parent and every right descendant is larger. Look at all
pairs of distinct nodes and measure the absolute gap between their values.
Return the smallest gap you can find.

Because the values arrive in sorted order during an in-order walk, the
closest pair in value must sit next to each other in that order, so a single
pass is enough.

**Example 1:**
```
Input: root = [4,2,6,1,3]
Output: 1
Explanation: Walking the tree in order visits 1,2,3,4,6. Neighbor gaps are
1,1,1,2, so the minimum is 1.
```

**Example 2:**
```
Input: root = [1,0,48,null,null,12,49]
Output: 1
Explanation: The ordered values are 0,1,12,48,49. The gap between 48 and 49
is 1, which is the smallest.
```

**Example 3:**
```
Input: root = [1,null,2]
Output: 1
Explanation: Only two nodes exist and they differ by 1.
```

**Constraints:**
- The tree holds between 2 and 100 nodes.
- `0 <= Node.val <= 10^5`
- The input is guaranteed to satisfy search-tree ordering.
