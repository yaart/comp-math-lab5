package yaart.s468198.dto;

import java.util.List;

public record InterpolationRequest(
        List<PointDTO> points,
        Double targetX
) {}