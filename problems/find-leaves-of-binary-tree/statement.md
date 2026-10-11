Repeatedly strip all current leaves from a binary tree: in round one remove
every leaf, in round two remove the leaves of what remains, and so on until
the tree is empty. Collect the removed values round by round.

For the tree `[1,2,3,4,5]` (root 1, children 2 and 3, with 2 parenting 4 and
5), round one takes `[4,5,3]`, round two takes `[2]`, and round three takes
`[1]`.

**Adaptation note:** the leaf groups are returned as a 2D integer list; values
inside one round may appear in any order, but rounds stay ordered from the
outer leaves inward.

**Example 1:**
```
Input: root = [1,2,3,4,5]
Output: [[4,5,3],[2],[1]]
Explanation: Leaves [4,5,3] fall first, then [2], then [1].
```

**Example 2:**
```
Input: root = [1]
Output: [[1]]
```

**Example 3:**
```
Input: root = []
Output: []
```

**Constraints:**
- The tree holds between 0 and 100 nodes, with values in `[-100, 100]`.
