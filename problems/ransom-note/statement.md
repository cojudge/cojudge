Decide whether one string can be assembled from the letters of another.

Given a target text `ransomNote` and a source text `magazine`, both made of lowercase English letters, determine whether the target can be built by taking letters from the source. Each source character may be used at most once, so the source must contain every needed letter at least as many times as the target asks for it. Return `true` when construction is possible and `false` otherwise.

**Example 1:**
```
Input: ransomNote = "a", magazine = "b"
Output: false
Explanation: The source lacks the letter a entirely.
```

**Example 2:**
```
Input: ransomNote = "aa", magazine = "ab"
Output: false
Explanation: Only one a is available but two are needed.
```

**Example 3:**
```
Input: ransomNote = "aa", magazine = "aab"
Output: true
Explanation: Two copies of a exist, covering the request.
```

**Constraints:**
- `1 <= ransomNote.length, magazine.length <= 10^5`
- Both strings consist of lowercase English letters.
