An N-ary tree lets each node carry any number of ordered children. Here the tree arrives as a single string `data` using breadth order with `null` marking each new sibling group: `[1,null,3,2,4,null,5,6]` means root `1` with children `3, 2, 4`, and `3` with children `5, 6`. The empty tree is `[]`.

Return the level-order grouping of values: a list where entry `k` holds all node values at depth `k`, starting with the root alone.

**Example 1:**
```
Input: data = "[1,null,3,2,4,null,5,6]"
Output: [[1],[3,2,4],[5,6]]
Explanation: Depth 0 holds 1, depth 1 holds its three children, depth 2 holds the two grandchildren.
```

**Example 2:**
```
Input: data = "[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]"
Output: [[1],[2,3,4,5],[6,7,8,9,10],[11,12,13],[14]]
Explanation: Each depth collects exactly the nodes at that distance from the root.
```

**Example 3:**
```
Input: data = "[]"
Output: []
Explanation: No nodes means no levels.
```

**Constraints:**
- Node count lies in `[0, 10^4]`.
- Node values are integers; height is at most 1000.

Adaptation: the source takes an N-ary `Node` object, which this judge cannot express. Input is therefore the level-order string described above, and output is `int_list_2d`; parsing happens inside the reference.
