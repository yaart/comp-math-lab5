package yaart.s468198.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import yaart.s468198.dto.InterpolationResponse;
import yaart.s468198.dto.PointDTO;
import yaart.s468198.utils.MathUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

@Slf4j
@Service
public class InterpolationService {

    public List<InterpolationResponse> calculateAll(List<PointDTO> points, double targetX) {
        long distinctXCount = points.stream().map(PointDTO::x).distinct().count();

        if (distinctXCount != points.size()) {
            throw new IllegalArgumentException("Ошибка: найдены точки с одинаковым значением X.");
        }

        points.sort(Comparator.comparingDouble(PointDTO::x));

        double minX = points.get(0).x();
        double maxX = points.get(points.size() - 1).x();

        if (targetX < minX || targetX > maxX) {
            throw new IllegalArgumentException(
                    String.format("Ошибка: Точка %f находится вне диапазона интерполяции [%f, %f]. Экстраполяция запрещена.",
                            targetX, minX, maxX)
            );
        }

        double[][] diffTable = computeDifferenceTable(points);
        List<List<Double>> serializableTable = convertToList(diffTable);

        List<InterpolationResponse> results = new ArrayList<>();

        results.add(new InterpolationResponse("Многочлен Лагранжа", calculateLagrange(points, targetX), serializableTable,
                generateCurve(points, x -> calculateLagrange(points, x))));

        results.add(calculateNewton(points, diffTable, targetX, serializableTable));
        results.add(calculateGauss(points, diffTable, targetX, serializableTable));
        results.add(calculateStirling(points, diffTable, targetX, serializableTable));
        results.add(calculateBessel(points, diffTable, targetX, serializableTable));

        return results;
    }

    private List<PointDTO> generateCurve(List<PointDTO> points, Function<Double, Double> formula) {
        List<PointDTO> curvePoints = new ArrayList<>();
        double minX = points.get(0).x();
        double maxX = points.get(points.size() - 1).x();
        int steps = 1000;
        double step = (maxX - minX) / steps;

        for (int i = 0; i <= steps; i++) {
            double x = minX + i * step;
            curvePoints.add(new PointDTO(x, formula.apply(x)));
        }
        return curvePoints;
    }

    private double[][] computeDifferenceTable(List<PointDTO> points) {
        int n = points.size();
        double[][] table = new double[n][n];
        for (int i = 0; i < n; i++) table[i][0] = points.get(i).y();
        for (int j = 1; j < n; j++) {
            for (int i = 0; i < n - j; i++) {
                table[i][j] = table[i + 1][j - 1] - table[i][j - 1];
            }
        }
        return table;
    }

    private double calculateLagrange(List<PointDTO> points, double x) {
        double result = 0;
        int n = points.size();
        for (int i = 0; i < n; i++) {
            double term = points.get(i).y();
            for (int j = 0; j < n; j++) {
                if (i != j) term *= (x - points.get(j).x()) / (points.get(i).x() - points.get(j).x());
            }
            result += term;
        }
        return result;
    }

    private InterpolationResponse calculateNewton(List<PointDTO> points, double[][] table, double x, List<List<Double>> sTable) {
        int n = points.size();
        double x0 = points.get(0).x();
        double xn = points.get(n - 1).x();

        boolean isForward = x <= (x0 + xn) / 2.0;
        String methodName = isForward ? "Ньютон (I формула)" : "Ньютон (II формула)";

        double res = calculateNewtonValue(points, table, x);

        return new InterpolationResponse(methodName, res, sTable,
                generateCurve(points, val -> calculateNewtonValue(points, table, val)));
    }

    private double calculateNewtonValue(List<PointDTO> points, double[][] table, double x) {
        int n = points.size();
        double h = points.get(1).x() - points.get(0).x();
        double x0 = points.get(0).x();
        double xn = points.get(n - 1).x();
        double t = (x - x0) / h;

        if (x <= (x0 + xn) / 2.0) {
            double res = table[0][0];
            double tProd = 1;
            for (int i = 1; i < n; i++) {
                tProd *= (t - i + 1);
                res += (tProd * table[0][i]) / MathUtils.factorial(i);
            }
            return res;
        } else {
            t = (x - xn) / h;
            double res = table[n - 1][0];
            double tProd = 1;
            for (int i = 1; i < n; i++) {
                tProd *= (t + i - 1);
                res += (tProd * table[n - 1 - i][i]) / MathUtils.factorial(i);
            }
            return res;
        }
    }

    private InterpolationResponse calculateGauss(List<PointDTO> points, double[][] table, double x, List<List<Double>> sTable) {
        int n = points.size();
        int mid = n / 2;
        double h = points.get(1).x() - points.get(0).x();
        double t = (x - points.get(mid).x()) / h;

        boolean isFirst = t >= 0;
        String methodName = isFirst ? "Гаусс (I формула)" : "Гаусс (II формула)";

        double res = calculateGaussValue(points, table, x);

        return new InterpolationResponse(methodName, res, sTable,
                generateCurve(points, val -> calculateGaussValue(points, table, val)));
    }

    private double calculateGaussValue(List<PointDTO> points, double[][] table, double x) {
        int n = points.size();
        int mid = n / 2;
        double h = points.get(1).x() - points.get(0).x();
        double xMid = points.get(mid).x();
        double t = (x - xMid) / h;
        double res = table[mid][0];

        if (t >= 0) {
            double tProd = t;
            res += tProd * table[mid][1];
            for (int i = 2; i < n; i++) {
                int k = i / 2;
                int rowIdx = mid - k;
                if (rowIdx < 0 || rowIdx >= n || (rowIdx + i) >= n) break;
                if (i % 2 == 0) tProd *= (t - k); else tProd *= (t + k);
                res += (tProd * table[rowIdx][i]) / MathUtils.factorial(i);
            }
        } else {
            if (mid - 1 >= 0) {
                double tProd = t;
                res += tProd * table[mid - 1][1];
                for (int i = 2; i < n; i++) {
                    int k = i / 2;
                    int rowIdx = mid - 1 - k;
                    if (rowIdx < 0 || rowIdx >= n || (rowIdx + i) >= n) break;
                    if (i % 2 == 0) tProd *= (t + k); else tProd *= (t - k);
                    res += (tProd * table[rowIdx][i]) / MathUtils.factorial(i);
                }
            }
        }
        return res;
    }

    private InterpolationResponse calculateStirling(List<PointDTO> points, double[][] table, double x, List<List<Double>> sTable) {
        return new InterpolationResponse("Стирлинг", calculateStirlingValue(points, table, x), sTable,
                generateCurve(points, val -> calculateStirlingValue(points, table, val)));
    }

    private double calculateStirlingValue(List<PointDTO> points, double[][] table, double x) {
        int n = points.size();
        int mid = n / 2;
        double h = points.get(1).x() - points.get(0).x();
        double xMid = points.get(mid).x();
        double t = (x - xMid) / h;

        double res = table[mid][0];
        double t2 = t * t;

        res += t * (table[mid - 1][1] + table[mid][1]) / 2.0;

        double tProd = t2;
        for (int i = 2; i < n; i++) {
            int k = i / 2;
            int rowIdx = mid - k;

            if (rowIdx < 0 || (rowIdx + i) >= n) break;

            if (i % 2 == 0) {
                res += (tProd * table[rowIdx][i]) / MathUtils.factorial(i);
                tProd *= (t2 - k * k);
            } else {
                res += (tProd * t * (table[rowIdx - 1][i] + table[rowIdx][i]) / 2.0) / MathUtils.factorial(i);
            }
        }
        return res;
    }

    private InterpolationResponse calculateBessel(List<PointDTO> points, double[][] table, double x, List<List<Double>> sTable) {
        return new InterpolationResponse("Бессель", calculateBesselValue(points, table, x), sTable,
                generateCurve(points, val -> calculateBesselValue(points, table, val)));
    }

    private double calculateBesselValue(List<PointDTO> points, double[][] table, double x) {
        int n = points.size();
        int mid = n / 2;
        if (mid + 1 >= n) return table[mid][0];

        double h = points.get(1).x() - points.get(0).x();
        double xMid = points.get(mid).x();
        double t = (x - xMid) / h;

        double res = (table[mid][0] + table[mid + 1][0]) / 2.0;

        res += (t - 0.5) * table[mid][1];

        double tProd = t * (t - 1);

        for (int i = 2; i < n; i++) {
            int k = i / 2;
            int rowIdx = mid - k;

            if (rowIdx < 0 || (rowIdx + i) >= n) break;

            if (i % 2 == 0) {
                double diffAvg = (table[rowIdx][i] + table[rowIdx + 1][i]) / 2.0;
                res += (tProd / MathUtils.factorial(i)) * diffAvg;
                tProd *= (t - k) * (t + k - 1);
            } else {
                res += (tProd * (t - 0.5) / MathUtils.factorial(i)) * table[rowIdx][i];
            }
        }
        return res;
    }

    private List<List<Double>> convertToList(double[][] table) {
        List<List<Double>> list = new ArrayList<>();
        for (double[] row : table) {
            List<Double> listRow = new ArrayList<>();
            for (double val : row) listRow.add(MathUtils.round(val, 8));
            list.add(listRow);
        }
        return list;
    }
}