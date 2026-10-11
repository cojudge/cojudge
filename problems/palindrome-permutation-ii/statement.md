Given a string `s`, return all distinct orderings of its characters that read the same forward and backward. Each result must use every character exactly once. Return the results in any order, or an empty list when no palindromic ordering exists.

**Example 1:**
```
Input: s = "aabb"
Output: ["abba","baab"]
Explanation: Halves "ab" and "ba" mirror to full palindromes "abba" and "baab".
```

**Example 2:**
```
Input: s = "abc"
Output: []
Explanation: Three different characters mean more than one odd count, so no palindrome exists.
```

**Example 3:**
```
Input: s = "aaa"
Output: ["aaa"]
Explanation: All characters match, giving a single distinct palindrome.
```

**Constraints:**
- `1 <= s.length <= 16`
- `s` consists of lowercase English letters.
