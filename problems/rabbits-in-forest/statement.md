Several rabbits each claim a number: when asked how many other rabbits share
their fur color, rabbit `i` answers with `answers[i]`. Different rabbits
that name the same number might belong to one shared color group or to
several separate groups, and rabbits that name different numbers surely
have different colors.

Given all the answers, estimate the smallest total population that could
have produced them. Every rabbit that spoke must fit into some color group
whose size matches its answer plus one (itself plus the others it counted).

**Example 1:**
```
Input: answers = [1,1,2]
Output: 5
Explanation: Two rabbits each see one partner, so they can form a pair.
The third rabbit sees two partners, needing a trio of its own color.
Together that is 2 + 3 = 5 rabbits.
```

**Example 2:**
```
Input: answers = [10,10,10]
Output: 11
Explanation: Each of the three speakers claims ten same-color companions,
so all three can belong to a single group of eleven.
```

**Example 3:**
```
Input: answers = [0,0,1,1,1]
Output: 6
Explanation: The two zeros each live alone (two groups of one). The three
ones need groups of two, so two of them pair up and the third needs a
partner who stayed silent, giving 2 + 2 + 2 = 6.
```

**Constraints:**
- `1 <= answers.length <= 1000`
- `0 <= answers[i] < 1000`
