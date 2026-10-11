Given a short string `s` and a longer string `t`, decide whether `s` can be obtained from `t` by erasing zero or more characters while leaving the order of the survivors untouched. For instance, keeping positions `0, 2, 4` of `"abcde"` yields `"ace"`, so `"ace"` qualifies, whereas swapping two letters does not.

Return `true` when such a deletion pattern exists and `false` otherwise. An empty `s` is a subsequence of every `t`.

**Example 1:**
```
Input: s = "abc", t = "ahbgdc"
Output: true
Explanation: Keep the 'a' at index 0, the 'b' at index 2 and the 'c' at
index 5 of t.
```

**Example 2:**
```
Input: s = "axc", t = "ahbgdc"
Output: false
Explanation: After matching 'a', no 'x' appears later in t.
```

**Example 3:**
```
Input: s = "", t = "ahbgdc"
Output: true
Explanation: Erasing everything leaves the empty string.
```

**Constraints:**
- `0 <= s.length <= 100`
- `0 <= t.length <= 10^4`
- `s` and `t` contain only lowercase English letters.
