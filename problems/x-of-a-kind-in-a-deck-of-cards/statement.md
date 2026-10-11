You are given an integer array `deck` where each entry is the value written on one card. Decide whether the whole deck can be split into groups satisfying all of these rules:

- Every group contains the same number of cards `X`, with `X >= 2`.
- All cards inside a single group show the same value.

Return `true` if such a split exists, otherwise `false`.

**Example 1:**
```
Input: deck = [1,2,3,4,4,3,2,1]
Output: true
Explanation: Four pairs [1,1], [2,2], [3,3], [4,4] use X = 2.
```

**Example 2:**
```
Input: deck = [1,1,1,2,2,2,3,3]
Output: false
Explanation: The counts are 3, 3 and 2, which share no common divisor >= 2.
```

**Example 3:**
```
Input: deck = [1,1,2,2,2,2]
Output: true
Explanation: Use X = 2: [1,1], [2,2], [2,2].
```

**Constraints:**
- `1 <= deck.length <= 10^4`
- `0 <= deck[i] < 10^4`
