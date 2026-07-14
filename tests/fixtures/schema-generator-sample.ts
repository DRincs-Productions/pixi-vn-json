export interface SamplePosition {
    x: number;
    y: number;
}

/** A stand-in for a canvas transition props interface — a mix of primitives and one nested object. */
export interface SampleTransitionProps {
    duration?: number;
    direction?: "left" | "right";
    position?: SamplePosition;
}

export interface SampleWrapper {
    props: SampleTransitionProps;
}
