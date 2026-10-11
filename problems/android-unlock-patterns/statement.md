A phone lock screen shows nine dots in a 3x3 grid numbered row by row:

```
1 2 3
4 5 6
7 8 9
```

A pattern is an ordered sequence of distinct dots with length between `m` and `n` inclusive. After touching a dot, the next dot is chosen under one movement rule: sliding straight over an untouched intermediate dot is forbidden — such a jump is allowed only when the dot being jumped over has already been visited. Diagonal neighbours, side neighbours, and knight-style hops that cross no dot are always permitted.

Given `m` and `n`, count every valid pattern whose length falls in `[m, n]`.

**Example 1:**
```
Input: m = 1, n = 1
Output: 9
Explanation: Each lone dot is a valid length-1 pattern.
```

**Example 2:**
```
Input: m = 1, n = 2
Output: 65
Explanation: 9 one-dot patterns plus 56 ordered two-dot hops give 65.
```

**Example 3:**
```
Input: m = 2, n = 2
Output: 56
Explanation: Exactly the 56 valid two-dot hops count.
```

**Constraints:**
- `1 <= m <= n <= 9`
