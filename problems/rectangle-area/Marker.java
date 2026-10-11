import java.util.*;
class Marker {
    public int computeArea(int ax1, int ay1, int ax2, int ay2, int bx1, int by1, int bx2, int by2) {
        int areaA = (ax2 - ax1) * (ay2 - ay1);
        int areaB = (bx2 - bx1) * (by2 - by1);
        int overlapW = Math.min(ax2, bx2) - Math.max(ax1, bx1);
        int overlapH = Math.min(ay2, by2) - Math.max(ay1, by1);
        int overlap = 0;
        if (overlapW > 0 && overlapH > 0) overlap = overlapW * overlapH;
        return areaA + areaB - overlap;
    }
    public boolean isCorrect(int ax1, int ay1, int ax2, int ay2, int bx1, int by1, int bx2, int by2, int output) {
        return output == computeArea(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2);
    }
}
