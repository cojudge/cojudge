Write out all positive integers in order, glued together into one endless digit string: `12345678910111213...`. Given a one-based position `n` into that string, report which digit sits there.

For example, positions `1` through `9` hold `1` through `9`, position `10` holds the `'1'` of `10`, and position `11` holds the `'0'` of `10`.

**Example 1:**
```
Input: n = 3
Output: 3
Explanation: The prefix is "123...", so position 3 holds '3'.
```

**Example 2:**
```
Input: n = 11
Output: 0
Explanation: Positions 10-11 hold "10"; the second of the pair is '0'.
```

**Example 3:**
```
Input: n = 15
Output: 2
Explanation: Positions 10-11 hold "10", 12-13 hold "11", 14-15 hold "12";
position 15 is the '2' of 12.
```

**Constraints:**
- `1 <= n <= 2^31 - 1`
