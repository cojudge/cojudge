Consider the same board and move as in Flip Game: a move flips one occurrence of `"++"`
into `"--"`. Two players now alternate moves, and the player that cannot move loses. Both
play perfectly. Given the starting board `currentState`, decide whether the player to move
has a forced win.

**Example 1:**
```
Input: currentState = "++++"
Output: true
Explanation: Flip the middle pair to "+--+", leaving the opponent with no move.
```

**Example 2:**
```
Input: currentState = "+"
Output: false
Explanation: No move exists, so the first player loses at once.
```

**Example 3:**
```
Input: currentState = "+++++"
Output: false
Explanation: Every first flip leaves a board from which the opponent forces a win.
```

**Constraints:**
- `1 <= currentState.length <= 60`
- `currentState` contains only `'+'` and `'-'`.
