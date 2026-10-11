Each node in an N-ary tree may have any number of ordered children. The tree arrives as a single string `data` holding a bracketed token list in level order, where `null` ends each node's child group. For instance `"[1,null,3,2,4,null,5,6]"` means root 1 with children 3, 2, 4, and node 3 with children 5, 6. The empty tree is `"[]"`.

Return the postorder visit order: each node's children left to right first, then the node itself.

**Constraints:**
- Token count is at most `10^4`.
- Values fit in 32-bit signed integers.

Adaptation: the source takes an N-ary `Node` object, which this judge cannot express. Input is therefore the level-order string described above, and output is `int_list`; parsing happens inside the reference.
