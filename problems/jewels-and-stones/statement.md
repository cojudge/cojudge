You are handed two strings: `jewels` lists the stone kinds that count as jewels, and `stones` lists the stones you own. Each character is one stone kind, and upper- versus lowercase matters (`a` differs from `A`).

Count how many characters of `stones` also appear in `jewels`.

**Example 1:**
```
Input: jewels = "aA", stones = "aAAbbbb"
Output: 3
Explanation: The stones are a, A, A, b, b, b, b; the first three are jewels.
```

**Example 2:**
```
Input: jewels = "z", stones = "ZZ"
Output: 0
Explanation: Case differs, so neither Z is a z jewel.
```

**Example 3:**
```
Input: jewels = "abc", stones = "aabbccdd"
Output: 6
Explanation: Two a's, two b's, and two c's are jewels; the d's are not.
```

**Constraints:**
- `1 <= jewels.length, stones.length <= 50`
- Both strings hold only English letters
- All characters of `jewels` are distinct
