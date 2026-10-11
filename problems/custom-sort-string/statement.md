You receive a helper string `order` that lists distinct lower-case letters
in a custom priority sequence, plus a second string `s` to rearrange. Shrink
or expand nothing: the output must be a permutation of `s` holding exactly
the same multiset of characters.

The rule: whenever a letter `x` appears earlier than a letter `y` inside
`order`, every copy of `x` in your answer must stand before every copy of
`y`. Letters of `s` that never occur in `order` may appear in any trailing
positions, in any order among themselves.

Any permutation meeting those conditions is accepted.

**Example 1:**
```
Input: order = "cba", s = "abcd"
Output: "cbad"
Explanation: The ranked letters appear as c, then b, then a. The leftover
d has no rank, so it goes at the end.
```

**Example 2:**
```
Input: order = "bcafg", s = "abcd"
Output: "bcad"
Explanation: The ranked prefix is b, c, a; d is unranked and trails.
```

**Example 3:**
```
Input: order = "kqep", s = "pekeq"
Output: "kqeep"
Explanation: Ordering by the ranks k < q < e < p reshuffles the five
characters accordingly.
```

**Constraints:**
- `1 <= order.length <= 26`
- `1 <= s.length <= 200`
- `order` and `s` hold only lower-case English letters.
- All characters of `order` are unique.
