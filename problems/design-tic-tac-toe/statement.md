This is an offline adaptation of a game task. Instead of writing a class, you write one function that replays a whole match:

```
runTicTacToe(operations, args)
```

`operations[i]` is either `"TicTacToe"` (create a board) or `"move"`. `args[i]` carries the matching argument: `args[0]` is `[n]` (board is `n x n`), and each later entry is `[row, col, player]` describing a placement by player 1 or 2. Both arrays share the same length, and every placement targets an empty cell.

After each placement, determine the game state: return `1` when player 1 has just completed a full row, column, or diagonal; `2` when player 2 has done so; otherwise `0`. Moves never undo a decided win in the test data beyond reporting it.

Return the list of those results, one per `move`, in order. The constructor contributes nothing.

**Example 1:**
```
Input: operations = ["TicTacToe","move","move","move","move","move","move","move"], args = [[3],[0,0,1],[0,2,2],[2,2,1],[1,1,2],[2,0,1],[1,0,2],[2,1,1]]
Output: [0,0,0,0,0,0,1]
Explanation: Player 1 fills the bottom row (2,0), (2,2), (2,1) across three turns; the win is reported on the final move.
```

**Example 2:**
```
Input: operations = ["TicTacToe","move","move","move"], args = [[2],[0,0,1],[1,1,2],[0,1,1]]
Output: [0,0,1]
Explanation: Player 1 completes the top row of the 2x2 board on the third placement.
```

**Example 3:**
```
Input: operations = ["TicTacToe","move","move","move"], args = [[3],[0,0,1],[1,1,1],[2,2,1]]
Output: [0,0,1]
Explanation: Player 1 completes the main diagonal.
```

**Constraints:**
- `2 <= n <= 100`
- `0 <= row, col < n`
- `player` is `1` or `2`.
- Each cell is used at most once.

**Adaptation note:** The classic version exposes a `TicTacToe` class with a `move` method. Here moves are replayed by `runTicTacToe` returning all `move` outcomes.
