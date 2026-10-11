You are given a strictly increasing list `arr` whose first entry is `1`
and whose remaining entries are primes. Consider every quotient formed by
picking two positions `i < j` and computing `arr[i] / arr[j]`. Sorting all
those quotients from small to large, pick the `k`-th one (counting from 1)
and report it as the pair `[arr[i], arr[j]]`.

Return the numerator and denominator as a two-element integer array. No
floating-point comparison is needed; cross-multiplication decides the order
exactly.

**Example 1:**
```
Input: arr = [1,2,3,5], k = 3
Output: [2,5]
Explanation: The ordered quotients start 1/5, 1/3, 2/5, 1/2, 3/5, 2/3.
The third one uses numerator 2 and denominator 5.
```

**Example 2:**
```
Input: arr = [1,7], k = 1
Output: [1,7]
Explanation: Only one quotient exists.
```

**Example 3:**
```
Input: arr = [1,2,3,5,7], k = 4
Output: [1,5]
Explanation: Listing the ten quotients in order puts 1/5 fourth.
```

**Constraints:**
- `2 <= arr.length <= 1000`
- `1 <= arr[i] <= 3 * 10^4`
- `arr[0] == 1`
- `arr[i]` is prime for `i > 0`.
- Values are unique and strictly increasing.
- `1 <= k <= arr.length * (arr.length - 1) / 2`
