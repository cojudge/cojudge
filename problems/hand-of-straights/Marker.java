import java.util.*;

class Marker {
    public boolean isNStraightHand(int[] hand, int groupSize) {
        if (groupSize <= 0 || hand.length % groupSize != 0) return false;

        TreeMap<Integer, Integer> counts = new TreeMap<>();
        for (int card : hand) counts.merge(card, 1, Integer::sum);

        while (!counts.isEmpty()) {
            int first = counts.firstKey();
            int groupsStartingHere = counts.get(first);
            for (int offset = 0; offset < groupSize; offset++) {
                long rank = (long) first + offset;
                if (rank > Integer.MAX_VALUE) return false;
                int card = (int) rank;
                int available = counts.getOrDefault(card, 0);
                if (available < groupsStartingHere) return false;
                if (available == groupsStartingHere) counts.remove(card);
                else counts.put(card, available - groupsStartingHere);
            }
        }
        return true;
    }

    public boolean isCorrect(int[] hand, int groupSize, boolean output) {
        return isNStraightHand(hand, groupSize) == output;
    }
}
