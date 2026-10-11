Alice and Bob play a further row-removal contest. A row of stones carries integer scores listed in `stoneValue`.

Alice moves first, then the two alternate. Each move removes stones only from the front of the remaining row: the player picks up 1, 2, or 3 stones there.

Every stone a player picks up adds its value to that player's total. Both totals begin at 0.

Whoever holds the larger total once the row is gone wins; equal totals mean a drawn game. Play runs until every stone is gone.

Both sides act optimally.

Return `"Alice"` when optimal play puts Alice in front, `"Bob"` when it puts Bob in front, and `"Tie"` when optimal play ends level.

**Example 1:**
```
Input: stoneValue = [1,2,3,7]
Output: "Bob"
Explanation: Alice has no winning opener. Her strongest line collects the first three stones for 6, after which Bob collects 7 and stays ahead.
```

**Example 2:**
```
Input: stoneValue = [1,2,3,-9]
Output: "Alice"
Explanation: Alice needs to sweep the first three stones on her opener, which secures victory while stranding Bob with a negative remainder.
```

**Example 3:**
```
Input: stoneValue = [1,2,3,6]
Output: "Tie"
Explanation: Alice cannot force a win here. Collecting the first three stones at the start salvages a draw; any other opener loses.
```

**Constraints:**
- 1 ≤ stoneValue.length ≤ 5 × 10<sup>4</sup>
- -1000 ≤ stoneValue[i] ≤ 1000
