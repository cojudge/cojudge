A row of colored balls sits on a board. Each ball shows one of five colors, written as single letters `R`, `Y`, `B`, `G` or `W`. You also hold a small collection of extra balls described by a second short string.

On each move you may take one ball from your hand and slide it into the row at any gap, including both ends. After the insertion, look for runs of three or more equal neighbors. Remove every such run. The removal can join previously separated equal balls, so keep deleting newly formed runs until none remain. If the row becomes empty you have cleared the board.

Your task is to use as few hand balls as possible to empty the row. Return that minimum count, or `-1` when the hand cannot finish the job.

**Constraints:**
- `1 <= board.length <= 16`
- `1 <= hand.length <= 5`
- Both strings use only `R`, `Y`, `B`, `G` and `W`
- The starting row never already contains three equal neighbors in a row
