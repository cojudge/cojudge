You are given a list of distinct words. A word is called buildable when every strict prefix of it (dropping one or more trailing letters) also appears in the list; single-letter words are buildable by default.

Among all buildable words, pick the longest. When several share that length, pick the alphabetically smallest. Return an empty string when nothing is buildable.

**Example 1:**
```
Input: words = ["w","wo","wor","worl","world"]
Output: "world"
Explanation: Every prefix of world is present, and it is the longest such word.
```

**Example 2:**
```
Input: words = ["a","banana","app","appl","ap","apply","apple"]
Output: "apple"
Explanation: apple and apply are both buildable; apple wins alphabetically.
```

**Example 3:**
```
Input: words = ["abc","bcd"]
Output: ""
Explanation: Without one-letter seeds, no longer word can be assembled.
```

**Constraints:**
- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 30`
- All words are distinct lowercase English strings.
