You own endless copies of several sticker sheets. Each sheet carries a lowercase word; cutting a sheet yields its letters for reuse, and sheets may be reused any number of times. Given the list `stickers` and a goal word `target`, determine the smallest number of sheets needed to assemble `target`. Cutting extra unused letters is allowed, but every letter of `target` must be covered. Return `-1` when the goal cannot be formed.

**Example 1:**
```
Input: stickers = ["with","example","science"], target = "thehat"
Output: 3
Explanation: Three sheets together supply all letters of "thehat".
```

**Example 2:**
```
Input: stickers = ["notice","possible"], target = "basicbasic"
Output: -1
Explanation: No sheet contains 'c', so the goal is unreachable.
```

**Example 3:**
```
Input: stickers = ["these","guess","about","garden","him"], target = "atomher"
Output: 3
Explanation: Three well-chosen sheets cover the seven letters.
```

**Constraints:**
- `1 <= stickers.length <= 50`
- `1 <= stickers[i].length <= 10`
- `1 <= target.length <= 15`
- All words use lowercase English letters.
