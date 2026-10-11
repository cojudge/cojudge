You are given two strings `s` and `goal` of the same alphabet. You may pick exactly two positions `i` and `j` with `i != j` and exchange the characters at those spots in `s`. After that single exchange, the result must equal `goal`.

Decide whether such an exchange exists. Note that the two positions must be different even when the strings already look alike; in that case a swap of two equal letters is the only way to succeed.

**Example 1:**
```
Input: s = "ab", goal = "ba"
Output: true
Explanation: Exchanging the two characters turns "ab" into "ba".
```

**Example 2:**
```
Input: s = "ab", goal = "ab"
Output: false
Explanation: The strings match, but no swap of distinct positions keeps them equal because all letters differ.
```

**Example 3:**
```
Input: s = "aa", goal = "aa"
Output: true
Explanation: Swapping the two equal letters leaves "aa" unchanged.
```

**Constraints:**
- `1 <= s.length <= 2 * 10^4`
- `s` and `goal` contain only lowercase English letters.
