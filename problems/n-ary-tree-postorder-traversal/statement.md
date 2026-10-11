Each node in an N-ary tree may have any number of ordered children. The tree arrives as a single string `data` holding a bracketed token list in level order, where `null` ends each node's child group. For instance `"[1,null,3,2,4,null,5,6]"` means root 1 with children 3, 2, 4, and node 3 with children 5, 6. The empty tree is `"[]"`.

Return the postorder visit order: each node's children left to right first, then the node itself.

**Example 1:**
```
Input: data = "[1,null,3,2,4,null,5,6]"
Output: [5,6,3,2,4,1]
```

**Example 2:**
```
Input: data = "[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]"
Output: [6,11,7,2,12,8,3,13,9,4,14,10,5,1]
```

**Example 3:**
```
Input: data = "[]"
Output: []
```

**Constraints:**
- Token count is at most `10^4`.
- Values fit in 32-bit signed integers.

Adaptation: the source takes an N-ary `Node` object, which this judge cannot express. Input is therefore the level-order string described above, and output is `int_list`; parsing happens inside the reference.
