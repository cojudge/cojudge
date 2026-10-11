For a given digit count `n`, look at all products of two `n`-digit numbers (from `10^(n-1)` up to `10^n - 1`, with `1..9` for `n = 1`). Among those products, pick the greatest one whose decimal writing reads the same forward and backward.

Because that palindrome can be enormous, return it modulo `1337`.

**Example 1:**

```
Input: n = 2
Output: 987
Explanation: The top palindrome product is 9009 = 99 x 91, and
9009 % 1337 = 987.
```

**Example 2:**

```
Input: n = 1
Output: 9
Explanation: The largest single-digit product that is a palindrome is 9.
```

**Example 3:**

```
Input: n = 3
Output: 123
Explanation: The top palindrome product is 906609 = 993 x 913, and
906609 % 1337 = 123.
```

**Constraints:**

- `1 <= n <= 8`
