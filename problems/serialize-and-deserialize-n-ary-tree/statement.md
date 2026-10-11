An N-ary tree gives every node any number of ordered children (unlike a binary tree, which caps at two). Your job in this adapted task is to round-trip such a tree through a string: take its level-order encoding, rebuild the tree in memory, serialize it again, and hand back the canonical encoding.

The encoding used here lists values in breadth order with `null` separating each group of siblings. For instance, `[1,null,3,2,4,null,5,6]` describes a root `1` whose children are `3, 2, 4`, where node `3` in turn has children `5, 6`. An empty tree is `[]`.

Write a function `codecRoundTrip` that accepts one such string `data`, parses it into an N-ary tree, serializes the tree back with the same grouping rule, parses once more and serializes again, then returns the final string. A correct implementation returns the canonical form of its input.

**Example 1:**
```
Input: data = "[1,null,3,2,4,null,5,6]"
Output: "[1,null,3,2,4,null,5,6]"
Explanation: Parsing and re-serializing preserves the grouping.
```

**Example 2:**
```
Input: data = "[]"
Output: "[]"
Explanation: The empty tree round-trips to itself.
```

**Example 3:**
```
Input: data = "[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]"
Output: "[1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]"
Explanation: A deeper tree survives the double round-trip unchanged.
```

**Constraints:**
- The node count lies in `[0, 10^4]`.
- Node values are integers.
- The input string follows the grouping rule above or is `[]`.

Adaptation: the source defines a `Codec` class over an N-ary `Node` type, which this judge cannot express (only binary `tree_node` exists). It is therefore modeled as `string` in and `string` out with parsing done inside the marker; implement the parse plus serialize logic yourself.
