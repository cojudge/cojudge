A full binary tree is one where every node either has no children at all or has exactly two children. You are given a count `n` and must produce every possible full shape with `n` nodes, each node holding the value `0`.

Because a tree object cannot travel directly across languages here, encode each tree as its breadth-first listing: walk level by level, write `0` for real nodes and `null` for missing spots, drop trailing `null` entries, and wrap the rest in brackets such as `[0,0,0]`. Return the collection of those strings in any order. When `n` is even no full tree exists, so return an empty collection.

**Constraints:**
- `1 <= n <= 20`

> **Adaptation note:** the original LeetCode signature returns `List<TreeNode>`, which has no portable cross-language encoding here. This problem instead returns `string_list`: each entry is the BFS serialization of one tree (level order with `null` placeholders, trailing nulls trimmed, wrapped like `[0,0,0]`). Grading compares the sorted sets of serializations.
