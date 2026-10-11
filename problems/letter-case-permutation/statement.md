You receive a short string that mixes English letters with digits. For every
letter you may independently decide to write it in lower case or in upper
case, while digits must stay exactly as they are. Collect every distinct
string that can be produced this way. The order of the collected strings
does not matter.

If the input holds `m` letters, the result holds `2^m` entries.

**Example 1:**
```
Input: s = "a1b2"
Output: ["a1b2","a1B2","A1b2","A1B2"]
Explanation: Two letters each have two cases, giving four combinations.
Digits 1 and 2 never change.
```

**Example 2:**
```
Input: s = "3z4"
Output: ["3z4","3Z4"]
Explanation: Only the middle letter varies.
```

**Example 3:**
```
Input: s = "123"
Output: ["123"]
Explanation: With no letters there is just the original string.
```

**Constraints:**
- `1 <= s.length <= 12`
- `s` holds only English letters (either case) and digits.
