Given a sentence `s` made of words separated by single spaces (no leading or trailing spaces), reverse the characters of each individual word while keeping the word order and spacing exactly the same.

For instance, each maximal block of non-space characters should appear backwards in the answer, but the blocks themselves stay where they were.

**Example 1:**
```
Input: s = "Let's take LeetCode contest"
Output: "s'teL ekat edoCteeL tsetnoc"
Explanation: Every word is flipped in place; the three gaps stay put.
```

**Example 2:**
```
Input: s = "God Ding"
Output: "doG gniD"
Explanation: Both words are reversed independently.
```

**Example 3:**
```
Input: s = "Hello"
Output: "olleH"
Explanation: A single word is simply mirrored.
```

**Constraints:**
- `1 <= s.length <= 5 * 10^4`
- `s` contains printable ASCII characters.
- Words are separated by single spaces with no leading or trailing spaces.
