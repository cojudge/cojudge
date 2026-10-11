Order the deck so a reveal-and-rotate routine exposes cards from smallest to largest.

The routine repeats two steps until the deck is empty: show the top card (it leaves the deck), then, if cards remain, move the new top card to the bottom. You may arrange the starting deck however you wish.

Given the distinct values in `deck`, return a starting order whose reveal sequence is sorted increasingly. The first entry of your answer is the top of the deck.

**Constraints:**
- `1 <= deck.length <= 1000`
- `1 <= deck[i] <= 10^6`
- All values in `deck` are distinct.
