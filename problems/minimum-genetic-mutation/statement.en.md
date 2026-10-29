A gene is an 8-letter string over the alphabet `A, C, G, T`. One mutation swaps a single position to a different letter. You are given a starting gene `startGene`, a target gene `endGene`, and a bank of approved intermediate genes. Every step of your mutation path (including the destination) must appear in the bank, except the start which is assumed valid even when absent from the bank.

Return the smallest number of mutations leading from start to target. Return `-1` when no such chain exists.

**Constraints:**
- `0 <= bank.length <= 10`
- Each of `startGene`, `endGene` and every bank entry has length 8 and uses only `A, C, G, T`.
