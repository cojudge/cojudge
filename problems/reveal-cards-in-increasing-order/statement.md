Order the deck so a reveal-and-rotate routine exposes cards from smallest to largest.

The routine repeats two steps until the deck is empty: show the top card (it leaves the deck), then, if cards remain, move the new top card to the bottom. You may arrange the starting deck however you wish.

Given the distinct values in `deck`, return a starting order whose reveal sequence is sorted increasingly. The first entry of your answer is the top of the deck.

**Example 1:**
```
Input: deck = [17,13,11,2,3,5,7]
Output: [2,13,3,11,5,17,7]
Explanation: Revealing gives 2, then 3, 5, 7, 11, 13, 17 as required.
```

**Example 2:**
```
Input: deck = [1,1000]
Output: [1,1000]
Explanation: Show 1, move 1000 to the bottom (it is alone), then show 1000.
```

**Constraints:**
- `1 <= deck.length <= 1000`
- `1 <= deck[i] <= 10^6`
- All values in `deck` are distinct.
