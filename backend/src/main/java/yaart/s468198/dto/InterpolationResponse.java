package yaart.s468198.dto;

import java.util.List;

public record InterpolationResponse(
        String methodName,
        double resultValue,
        List<List<Double>> differenceTable,
        List<PointDTO> plotPoints
) {}