A row of dominoes is written as a string where `L` means the piece already falls left, `R` means it falls right, and `.` means it stands upright. All standing dominoes then topple simultaneously in rounds: in each round, a standing piece falls left if its left neighbour already falls (or is falling) left, and falls right if its right neighbour falls right. A piece with one neighbour pulling left and the other pulling right stays upright (the forces balance). Fallen pieces never move again. Return the final configuration once nothing can change.

**Constraints:**
- `1 <= dominoes.length <= 10^5`
- `dominoes[i]` is `L`, `R`, or `.`
