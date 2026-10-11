A nested list holds integers and nested lists to any depth, for example
`[[1,1],2,[1,1]]` or `[1,[4,[6]]]`. Let the depth of an integer be the number
of lists wrapping it (outermost integers sit at depth 1). Let `maxDepth` be
the largest depth present. The inverse-depth sum weights each integer by
`maxDepth - depth + 1`, so the deepest values count once and shallower values
count more.

Thus `[[1,1],2,[1,1]]` scores `1+1+4+1+1 = 8`, and `[1,[4,[6]]]` scores
`3*1 + 2*4 + 1*6 = 17`.

**Adaptation note:** the `NestedInteger` API is replaced by a plain string
encoding such as `"[[1,1],2,[1,1]]"`. Implement
`depthSumInverse(nestedList)`, which parses that string and returns the
weighted sum.

**Example 1:**
```
Input: nestedList = "[[1,1],2,[1,1]]"
Output: 8
Explanation: Four ones at depth 2 count once each, and the two at depth 1
counts twice: 4*1 + 2*2 = 8.
```

**Example 2:**
```
Input: nestedList = "[1,[4,[6]]]"
Output: 17
Explanation: Depths are 1, 2, 3 with max depth 3, giving 1*3 + 4*2 + 6*1.
```

**Constraints:**
- The encoding holds integers `0 <= v <= 100` nested in `[` `]` with commas.
- Nesting depth is at most 20, total integers at most 100.
