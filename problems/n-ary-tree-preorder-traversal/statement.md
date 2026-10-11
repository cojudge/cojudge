Each node in an N-ary tree may have any number of ordered children. The tree arrives as a single string `data` holding a bracketed token list in level order, where `null` ends each node's child group. For instance `"[1,null,3,2,4,null,5,6]"` means root 1 with children 3, 2, 4, and node 3 with children 5, 6. The empty tree is `"[]"`.

Return the preorder visit order: each node before its children, with children handled left to right.

**Example 1:**
```
Input: data = "[1,null,3,2,4,null,5,6]"
Output: [1,3,5,6,2,4]
```

**Example 2:**
```
Input: data = "[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]"
Output: [1,2,6,7,11,3,8,12,4,9,13,5,10,14]
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
