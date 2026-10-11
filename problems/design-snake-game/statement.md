A snake moves on a `height x width` board, starting as a single cell at the
top-left corner `(0, 0)`. A list of food cells is given in the order they
appear: there is always at most one food cell on the board, and the next one
shows up only after the current one is eaten.

For each step you receive one direction: `U` (up), `D` (down), `L` (left) or
`R` (right). The snake advances its head one cell that way:

- When the new head leaves the board, the game ends.
- When the new head hits the snake's own body (excluding the tail cell that is
  vacated in the same step, unless the step eats food and the tail stays), the
  game ends.
- When the new head reaches the current food cell, the snake grows by one (the
  tail does not move) and the score increases by one.
- Otherwise the head advances and the tail vacates its cell; the score is
  unchanged.

Each move reports the current score, or `-1` once the game is over (every later
move also reports `-1`).

**Adaptation note:** instead of a stateful class, implement
`runSnakeGame(width, height, food, moves)`, which replays the move list and
returns one score per move.

**Example 1:**
```
Input: width = 3, height = 2, food = [[1,2],[0,1]], moves = ["R","D","R","U","L","U"]
Output: [0,0,1,1,2,-1]
Explanation: The snake eats at (1,2) on the third move and at (0,1) on the
fifth move, then crashes into itself on the last move.
```

**Example 2:**
```
Input: width = 2, height = 2, food = [], moves = ["R","D","L"]
Output: [0,0,0]
Explanation: With no food the score stays zero while the snake loops safely.
```

**Constraints:**
- `1 <= width, height <= 20`
- `0 <= food.length <= 50`, each `food[i] = [r, c]` with `0 <= r < height`, `0 <= c < width`
- `0 <= moves.length <= 200`, each move is one of `"U"`, `"D"`, `"L"`, `"R"`
