You receive `n` jobs numbered `0` through `n - 1`, packed as a 2D integer table `tasks` where `tasks[i] = [enqueueTimei, processingTimei]`: job `i` shows up at moment `enqueueTimei` and needs `processingTimei` units to finish.

A single-thread processor handles at most one job at a time under these rules:

- with nothing waiting while idle, it simply waits;
- once idle with work waiting, it takes the waiting job with the briefest processing span, using the smaller label to break ties;
- a begun job runs to completion with no pause;
- finishing one job, it may begin the next immediately with no gap.

List the labels in the sequence the processor handles them.

**Constraints:**

- `1 <= tasks.length <= 10^5`
- `1 <= enqueueTimei, processingTimei <= 10^9`
