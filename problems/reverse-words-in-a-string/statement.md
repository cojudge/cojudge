You are given a string `s` holding words separated by spaces. A word is a maximal run of non-space characters.

Reverse the order of the words and join them with exactly one space. Remove any leading or trailing spaces, and collapse every run of interior spaces to a single separator.

**Example 1:**
```
Input: s = "the sky is blue"
Output: "blue is sky the"
Explanation: The four words appear in opposite order.
```

**Example 2:**
```
Input: s = "  hello world  "
Output: "world hello"
Explanation: Extra edge spaces disappear in the answer.
```

**Example 3:**
```
Input: s = "a good   example"
Output: "example good a"
Explanation: Multiple gaps between words shrink to one space.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `s` holds English letters (both cases), digits, and spaces.
- At least one word exists in `s`.
