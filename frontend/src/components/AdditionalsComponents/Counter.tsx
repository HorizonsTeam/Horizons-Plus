import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, type CSSProperties } from "react";

import "./Counter.css";

/* ----------- Types ----------- */

type NumberProps = {
    mv: MotionValue<number>;
    number: number;
    height: number;
};

type DigitProps = {
    place: number;
    value: number;
    height: number;
    digitStyle?: CSSProperties;
};

type CounterProps = {
    value: number;
    fontSize?: number;
    padding?: number;
    places?: number[];
    gap?: number;
    borderRadius?: number;
    horizontalPadding?: number;
    textColor?: string;
    fontWeight?: number | string;
    containerStyle?: CSSProperties;
    counterStyle?: CSSProperties;
    digitStyle?: CSSProperties;
    gradientHeight?: number;
    gradientFrom?: string;
    gradientTo?: string;
    topGradientStyle?: CSSProperties;
    bottomGradientStyle?: CSSProperties;
};

/* ----------- Composants ----------- */

function Number({ mv, number, height }: NumberProps) {
    const y = useTransform(mv, (latest) => {
        const placeValue = latest % 10;
        const offset = (10 + number - placeValue) % 10;
        let memo = offset * height;
        if (offset > 5) {
            memo -= 10 * height;
        }
        return memo;
    });

    return (
        <motion.span className="counter-number" style={{ y }}>
            {number}
        </motion.span>
    );
}

function Digit({ place, value, height, digitStyle }: DigitProps) {
    const valueRoundedToPlace = Math.floor(value / place);
    const animatedValue = useSpring(valueRoundedToPlace);

    useEffect(() => {
        animatedValue.set(valueRoundedToPlace);
    }, [animatedValue, valueRoundedToPlace]);

    return (
        <div className="counter-digit" style={{ height, ...digitStyle }}>
            {Array.from({ length: 10 }, (_, i) => (
                <Number key={i} mv={animatedValue} number={i} height={height} />
            ))}
        </div>
    );
}

export default function Counter({
    value,
    fontSize = 100,
    padding = 0,
    places = [100, 10, 1],
    gap = 8,
    borderRadius = 4,
    horizontalPadding = 8,
    textColor = "white",
    fontWeight = "bold",
    containerStyle,
    counterStyle,
    digitStyle,
    gradientHeight = 16,
    gradientFrom = "transparent",
    gradientTo = "transparent",
    topGradientStyle,
    bottomGradientStyle,
}: CounterProps) {
    const height = fontSize + padding;

    const defaultCounterStyle: CSSProperties = {
        fontSize,
        gap,
        borderRadius,
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        color: textColor,
        fontWeight,
    };

    const defaultTopGradientStyle: CSSProperties = {
        height: gradientHeight,
        background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
    };

    const defaultBottomGradientStyle: CSSProperties = {
        height: gradientHeight,
        background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
    };

    return (
        <div className="counter-container left-0 right-0 top-0 bottom-0 p-2" style={containerStyle}>
            <div
                className="counter-counter"
                style={{ ...defaultCounterStyle, ...counterStyle }}
            >
                {places.map((place) => (
                    <Digit
                        key={place}
                        place={place}
                        value={value}
                        height={height}
                        digitStyle={digitStyle}
                    />
                ))}
            </div>
            <div className="gradient-container">
                <div
                    className="top-gradient"
                    style={topGradientStyle ?? defaultTopGradientStyle}
                />
                <div
                    className="bottom-gradient"
                    style={bottomGradientStyle ?? defaultBottomGradientStyle}
                />
            </div>
        </div>
    );
}
