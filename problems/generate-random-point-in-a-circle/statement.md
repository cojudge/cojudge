A circle is described by its radius and its center point. Write a routine that produces one point lying somewhere inside (or exactly on) that circle.

**Portable adaptation:** This task is a function version of a class design task. The radius and both center coordinates arrive as decimal strings so every language receives identical inputs, and the point is returned as a two-element list of decimal strings `[x, y]`. Floating answers are compared with tolerance rather than exact text match.

**Behavior:**

- Parse `radius`, `xCenter`, `yCenter` as double-precision values.
- Return two decimal strings that parse as finite doubles.
- The returned point must satisfy `distance((x, y), center) <= radius + 1e-9`.
- Any valid point counts as correct; the distribution is not graded. The reference uses a fixed seed for reproducibility, but user code may use any source of randomness (returning the center itself is also valid, though not uniform).

**Example 1:**

```
Input: radius = "1.0", xCenter = "0.0", yCenter = "0.0"
Output: ["0.123", "0.456"] (any pair with x^2 + y^2 <= 1 is accepted)
Explanation: Points are checked only by the radius bound, e.g. the center
["0.0","0.0"] would also pass.
```

**Example 2:**

```
Input: radius = "2.0", xCenter = "3.0", yCenter = "-1.0"
Output: ["3.5", "0.2"] (any pair within 2.0 of (3.0,-1.0) is accepted)
```

**Constraints:**

- `0 < radius <= 10^8`
- `-10^7 <= xCenter, yCenter <= 10^7`
- Inputs are finite decimal strings.
