You receive two lowercase strings `s` and `p`. Slide a window of length `p.length` across `s` and note every starting index where the window holds exactly the same multiset of letters as `p` (that is, some rearrangement of `p`). Return all such starts in any order.

**Example 1:**
```
Input: s = "cbaebabacd", p = "abc"
Output: [0,6]
Explanation: Windows at 0 ("cba") and 6 ("bac") each rearrange to "abc".
```

**Example 2:**
```
Input: s = "abab", p = "ab"
Output: [0,1,2]
Explanation: Every length-2 window here is a rearrangement of "ab".
```

**Constraints:**
- `1 <= s.length, p.length <= 3 * 10^4`
- Both strings use only lowercase English letters.

Adaptation: the source returns a list of integers; here it maps to `int_list`.
