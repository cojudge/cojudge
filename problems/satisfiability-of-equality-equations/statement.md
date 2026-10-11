You are given a list of equations over lowercase variables. Each equation has one
of two shapes: `x==y`, meaning `x` and `y` must hold equal values, or `x!=y`,
meaning they must hold different values.

Return `true` if the variables can be assigned values so that every equation
holds at the same time, and `false` otherwise.

**Example 1:**
```
Input: equations = ["a==b","b!=a"]
Output: false
Explanation: a and b cannot be equal and different simultaneously.
```

**Example 2:**
```
Input: equations = ["b==a","a==b"]
Output: true
Explanation: Setting both to the same value satisfies each equation.
```

**Example 3:**
```
Input: equations = ["a==b","b==c","a==c"]
Output: true
Explanation: One shared value for a, b and c works.
```

**Example 4:**
```
Input: equations = ["a==b","b!=c","c==a"]
Output: false
Explanation: The equalities force a, b and c together, contradicting b!=c.
```

**Constraints:**
- `1 <= equations.length <= 500`
- Each equation is exactly 4 characters: a lowercase letter, `==` or `!=`, and a lowercase letter.
