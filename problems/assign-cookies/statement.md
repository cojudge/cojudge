You are handing out cookies to a group of children. Child `i` has a greed factor `g[i]`, which is the smallest cookie size that will make that child content. Cookie `j` has size `s[j]`.

A cookie of size `x` satisfies a child of greed `y` exactly when `x >= y`. Each child receives at most one cookie, and each cookie can be given to at most one child.

Return the largest number of children that can be made content.

**Example 1:**
```
Input: g = [1,2,3], s = [1,1]
Output: 1
Explanation: Only one child can be satisfied: one size-1 cookie covers the child with greed 1, and the remaining cookie is too small for greed 2 or 3.
```

**Example 2:**
```
Input: g = [1,2], s = [1,2,3]
Output: 2
Explanation: Give the size-1 cookie to the first child and the size-2 cookie to the second child.
```

**Example 3:**
```
Input: g = [10,9,8,7], s = [5,6,7,8]
Output: 2
Explanation: The two biggest cookies satisfy the two least greedy children.
```

**Constraints:**
- `1 <= g.length, s.length <= 3 * 10^4`
- `1 <= g[i], s[j] <= 2^31 - 1`
