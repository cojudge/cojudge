You are handing out cookies to a group of children. Child `i` has a greed factor `g[i]`, which is the smallest cookie size that will make that child content. Cookie `j` has size `s[j]`.

A cookie of size `x` satisfies a child of greed `y` exactly when `x >= y`. Each child receives at most one cookie, and each cookie can be given to at most one child.

Return the largest number of children that can be made content.

**Constraints:**
- `1 <= g.length, s.length <= 3 * 10^4`
- `1 <= g[i], s[j] <= 2^31 - 1`
