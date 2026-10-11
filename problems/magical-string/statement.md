Consider an endless string that uses only the digits `1` and `2`. It starts `1, 2, 2, ...` and has a self-describing trait: reading the lengths of its blocks of equal digits, in order, reproduces the string itself. For instance the block sizes `1, 2, 2, 1, 1, 2, ...` spell out the same digit sequence.

Given `n`, look at the first `n` characters of this string and count how many of them are `1`.

**Example 1:**

```
Input: n = 6
Output: 3
Explanation: The opening six characters are 1 2 2 1 1 2, with three 1s.
```

**Example 2:**

```
Input: n = 1
Output: 1
Explanation: The first character alone is 1.
```

**Example 3:**

```
Input: n = 10
Output: 5
Explanation: The first ten characters hold five 1s.
```

**Constraints:**

- `1 <= n <= 10^5`
