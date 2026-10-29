Several rabbits each claim a number: when asked how many other rabbits share
their fur color, rabbit `i` answers with `answers[i]`. Different rabbits
that name the same number might belong to one shared color group or to
several separate groups, and rabbits that name different numbers surely
have different colors.

Given all the answers, estimate the smallest total population that could
have produced them. Every rabbit that spoke must fit into some color group
whose size matches its answer plus one (itself plus the others it counted).

**Constraints:**
- `1 <= answers.length <= 1000`
- `0 <= answers[i] < 1000`
