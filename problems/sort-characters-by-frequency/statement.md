You are given a string `s`. Count how often each character appears, then reorder the characters so that more frequent characters come first. Characters with the same frequency may appear in any order relative to each other.

Return any reordering that respects non-increasing frequency.

**Example 1:**
```
Input: s = "tree"
Output: "eert"
Explanation: Letter e appears twice while t and r appear once, so e comes first.
```

**Example 2:**
```
Input: s = "cccaaa"
Output: "aaaccc"
Explanation: Both letters appear three times, so either block order is fine.
```

**Example 3:**
```
Input: s = "Aabb"
Output: "bbAa"
Explanation: Letter b appears twice, A and a appear once each.
```

**Constraints:**
- `1 <= s.length <= 5 * 10^5`
- `s` contains letters, digits and spaces.
