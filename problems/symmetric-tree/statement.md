Decide whether a binary tree reads the same on both sides — that is, whether it is a mirror image of itself around its center.

Two trees are mirrors when their roots hold equal values and each left branch of one matches the corresponding right branch of the other, recursively. Check the root's left subtree against its right subtree in this mirrored fashion.

Return `true` when the whole structure is mirrored, otherwise `false`.

**Example 1:**
```
Input: root = [1,2,2,3,4,4,3]
Output: true
Explanation: Each level mirrors: [2,2] and [3,4,4,3] read the same forwards and backwards with matching structure.
```

**Example 2:**
```
Input: root = [1,2,2,null,3,null,3]
Output: false
Explanation: The lower levels differ — one side places a node where the mirror side has nothing.
```

**Example 3:**
```
Input: root = [1]
Output: true
Explanation: A lone node needs no partner.
```

**Constraints:**
- `0 <= number of nodes <= 1000`
- `-100 <= Node.val <= 100`
