You are given a candy board where each cell holds a digit character from `1` to `5` (`0` means empty after crushing). Repeatedly settle the board:

1. Crush: every horizontal or vertical run of at least three equal non-zero values disappears at once (all such cells become `0`). Overlapping runs crush together.
2. Drop: for each column, the surviving non-zero values fall to the bottom and zeros rise to the top.

Stop when a full scan finds nothing to crush. Return the stable board as one string per row (each row's characters joined left to right).

*Adaptation note:* the board arrives as `char_array_2d` and the answer is a `string_list` of row strings, mirroring the minesweeper layout so every language can express it. Digits stay single characters (`0` to `5`); Rust sees the board as its encoded string and parses it first.

**Example 1:**
```
Input: board = [["1","1","1","2"],["1","3","2","2"],["1","2","3","1"]]
Output: ["0002","0322","0231"]
Explanation: Five 1s form a top row plus left column cross; they empty, then the survivors above fall down.
```

**Example 2:**
```
Input: board = [["1","2","3"],["4","5","6"]]
Output: ["123","456"]
Explanation: No triple exists, so the board is unchanged.
```

**Example 3:**
```
Input: board = [["2","2","2"]]
Output: ["000"]
Explanation: The lone triple crushes to empties.
```

**Constraints:**
- `1 <= board.length, board[i].length <= 50`
- Each input cell is `1` to `5`; settled cells may be `0` to `5`.
- The board is rectangular.
