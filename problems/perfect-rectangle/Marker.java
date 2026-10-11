import java.util.*;
class Marker {
    public boolean isRectangleCover(int[][] rectangles) {
        long area = 0;
        int minX = Integer.MAX_VALUE, minY = Integer.MAX_VALUE;
        int maxX = Integer.MIN_VALUE, maxY = Integer.MIN_VALUE;
        Set<String> corners = new HashSet<>();
        for (int[] r : rectangles) {
            int x1 = r[0], y1 = r[1], x2 = r[2], y2 = r[3];
            area += (long) (x2 - x1) * (y2 - y1);
            minX = Math.min(minX, x1); minY = Math.min(minY, y1);
            maxX = Math.max(maxX, x2); maxY = Math.max(maxY, y2);
            String[] pts = {x1 + " " + y1, x1 + " " + y2, x2 + " " + y1, x2 + " " + y2};
            for (String p : pts) {
                if (!corners.add(p)) corners.remove(p);
            }
        }
        if (corners.size() != 4) return false;
        if (!corners.contains(minX + " " + minY)) return false;
        if (!corners.contains(minX + " " + maxY)) return false;
        if (!corners.contains(maxX + " " + minY)) return false;
        if (!corners.contains(maxX + " " + maxY)) return false;
        long bound = (long) (maxX - minX) * (maxY - minY);
        return area == bound;
    }
    public boolean isCorrect(int[][] rectangles, boolean output) {
        return output == isRectangleCover(rectangles);
    }
}
