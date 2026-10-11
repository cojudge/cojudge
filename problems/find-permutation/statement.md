A pattern string `s` of length `n` uses only the letters `I` (rising) and `D` (falling). It sketches a permutation of the numbers `1..n+1`: for each slot `i`, `I` demands `perm[i] < perm[i+1]` while `D` demands `perm[i] > perm[i+1]`.

Many permutations can fit the same sketch. Build the smallest one in dictionary order.

**Example 1:**

```
Input: s = "I"
Output: [1,2]
Explanation: Only [1,2] rises, so it is the answer.
```

**Example 2:**

```
Input: s = "DI"
Output: [2,1,3]
Explanation: Both [2,1,3] and [3,1,2] match D then I, but [2,1,3]
is smaller lexicographically.
```

**Example 3:**

```
Input: s = "DDI"
Output: [3,2,1,4]
Explanation: The two falls force the opening three values to descend,
then rise into 4.
```

**Constraints:**

- `1 <= s.length <= 10^5`
- Each `s[i]` is `I` or `D`.
