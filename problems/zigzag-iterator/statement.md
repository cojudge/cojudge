Given two integer lists, produce their zigzag interleaving.

**Adaptation:** the original design asks for an iterator class with `next`
and `hasNext`; here implement `zigzagIterate(v1, v2)` returning the whole
traversal: take one element from `v1`, then one from `v2`, alternating, and
drain whichever list remains when the other runs out.

**Examples:**
```
Input: v1 = [1,2], v2 = [3,4,5,6]
Output: [1,3,2,4,5,6]
```
```
Input: v1 = [1], v2 = []
Output: [1]
```
```
Input: v1 = [], v2 = [1]
Output: [1]
```

**Constraints:**
- `0 <= v1.length, v2.length <= 1000`
- `1 <= v1[i], v2[i] <= 1000` when present.
