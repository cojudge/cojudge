Two factions, Radiant and Dire, each hold seats in a Dota2 council.

The council votes in turns on a proposed game change. Senators act one after another in the order they appear in the string, skipping anyone already stripped of voting power, and the cycle repeats until a decision is reached. On a senator's turn, that senator has two possible moves:

- **Silence another senator:** pick a senator from the opposing side and remove every voting right of that senator for the present round and every later round.
- **Declare the outcome:** when every senator who can still vote belongs to the speaker's own faction, that senator proclaims its faction the winner and settles the game change.

You receive a string `senate` whose `i`-th character records the faction of the `i`-th senator: `'R'` stands for Radiant and `'D'` stands for Dire. When the string holds `n` characters, there are `n` senators in total.

Assume every senator votes with full foresight and always chooses the line most favorable to their own faction. Determine which faction ends up declaring the outcome. Respond with `"Radiant"` or `"Dire"`.

**Example 1:**

```
Input: senate = "RD"
Output: "Radiant"
Explanation: The opening Radiant senator removes the voting rights of the following senator during the first round.
```

**Example 2:**

```
Input: senate = "RDD"
Output: "Dire"
Explanation: The opening Radiant member blocks the next member's rights in the first round, after which the remaining Dire members take control.
```

**Constraints:**

- `n == senate.length`
- `1 <= n <= 10^4`
- `senate[i]` is either `'R'` or `'D'`.
