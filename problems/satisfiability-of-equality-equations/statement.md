You are given a list of equations over lowercase variables. Each equation has one
of two shapes: `x==y`, meaning `x` and `y` must hold equal values, or `x!=y`,
meaning they must hold different values.

Return `true` if the variables can be assigned values so that every equation
holds at the same time, and `false` otherwise.

**Constraints:**
- `1 <= equations.length <= 500`
- Each equation is exactly 4 characters: a lowercase letter, `==` or `!=`, and a lowercase letter.
