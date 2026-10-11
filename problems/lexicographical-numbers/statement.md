Consider how positive integers look when written as decimal strings and compared alphabetically: `"10"` starts with `'1'`, so it comes before `"2"`, even though ten is numerically larger than two. This task asks for the numbers from `1` through `n` arranged by that string ordering rather than by size.

Write a function that takes `n` and returns every integer in the interval `[1, n]`, sorted by the lexicographic order of its decimal representation.

**Example 1:**
```
Input: n = 13
Output: [1,10,11,12,13,2,3,4,5,6,7,8,9]
Explanation: The strings "1", "10", "11", "12", "13" all start with '1' and
come first; the remaining single-digit strings follow in order.
```

**Example 2:**
```
Input: n = 2
Output: [1,2]
Explanation: With only two values, dictionary order matches numeric order.
```

**Example 3:**
```
Input: n = 9
Output: [1,2,3,4,5,6,7,8,9]
Explanation: Single-digit values keep their natural order.
```

**Constraints:**
- `1 <= n <= 5 * 10^4`

Aim for a method that visits each value once and keeps only a constant amount of working memory besides the answer list.
