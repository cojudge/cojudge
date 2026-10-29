An N-ary tree lets each node carry any number of ordered children. Here the tree arrives as a single string `data` using breadth order with `null` marking each new sibling group: `[1,null,3,2,4,null,5,6]` means root `1` with children `3, 2, 4`, and `3` with children `5, 6`. The empty tree is `[]`.

Return the level-order grouping of values: a list where entry `k` holds all node values at depth `k`, starting with the root alone.

**Constraints:**
- Node count lies in `[0, 10^4]`.
- Node values are integers; height is at most 1000.

Adaptation: the source takes an N-ary `Node` object, which this judge cannot express. Input is therefore the level-order string described above, and output is `int_list_2d`; parsing happens inside the reference.
