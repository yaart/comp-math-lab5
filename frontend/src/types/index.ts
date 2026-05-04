export interface Point {
    x: number;
    y: number;
}

export interface InterpolationResponse {
    methodName: string;
    resultValue: number;
    differenceTable: number[][];
    plotPoints: Point[];
}

export interface InterpolationRequest {
    points: Point[];
    targetX: number;
}