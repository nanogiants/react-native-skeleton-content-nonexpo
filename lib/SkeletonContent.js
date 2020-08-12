"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_linear_gradient_1 = __importDefault(require("react-native-linear-gradient"));
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const react_native_redash_1 = require("react-native-redash");
const Constants_1 = require("./Constants");
const { useCode, set, cond, eq } = react_native_reanimated_1.default;
const { useState, useCallback } = React;
const styles = react_native_1.StyleSheet.create({
    absoluteGradient: {
        height: '100%',
        position: 'absolute',
        width: '100%'
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    gradientChild: {
        flex: 1
    }
});
const useLayout = () => {
    const [size, setSize] = useState({ width: 0, height: 0 });
    const onLayout = useCallback(event => {
        const { width, height } = event.nativeEvent.layout;
        setSize({ width, height });
    }, []);
    return [size, onLayout];
};
const SkeletonContent = ({ containerStyle = styles.container, easing = Constants_1.DEFAULT_EASING, duration = Constants_1.DEFAULT_DURATION, layout = [], animationType = Constants_1.DEFAULT_ANIMATION_TYPE, animationDirection = Constants_1.DEFAULT_ANIMATION_DIRECTION, isLoading = Constants_1.DEFAULT_LOADING, boneColor = Constants_1.DEFAULT_BONE_COLOR, highlightColor = Constants_1.DEFAULT_HIGHLIGHT_COLOR, children }) => {
    const animationValue = react_native_redash_1.useValue(0);
    const loadingValue = react_native_redash_1.useValue(isLoading ? 1 : 0);
    const shiverValue = react_native_redash_1.useValue(animationType === 'shiver' ? 1 : 0);
    const [componentSize, onLayout] = useLayout();
    useCode(() => cond(eq(loadingValue, 1), [
        cond(eq(shiverValue, 1), [
            set(animationValue, react_native_redash_1.loop({
                duration,
                easing
            }))
        ], [
            set(animationValue, react_native_redash_1.loop({
                duration: duration / 2,
                easing,
                boomerang: true
            }))
        ])
    ]), [loadingValue, shiverValue, animationValue]);
    const getGradientStartDirection = () => {
        let direction = { x: 0, y: 0 };
        if (animationType === 'shiver') {
            if (animationDirection === 'horizontalLeft' ||
                animationDirection === 'horizontalRight' ||
                animationDirection === 'verticalTop' ||
                animationDirection === 'verticalDown' ||
                animationDirection === 'diagonalDownRight') {
                direction = { x: 0, y: 0 };
            }
            else if (animationDirection === 'diagonalTopLeft') {
                direction = { x: 1, y: 1 };
            }
            else if (animationDirection === 'diagonalTopRight') {
                direction = { x: 0, y: 1 };
            }
            else if (animationDirection === 'diagonalDownLeft') {
                direction = { x: 1, y: 0 };
            }
        }
        return direction;
    };
    const getGradientEndDirection = () => {
        let direction = { x: 0, y: 0 };
        if (animationType === 'shiver') {
            if (animationDirection === 'horizontalLeft' ||
                animationDirection === 'horizontalRight' ||
                animationDirection === 'diagonalTopRight') {
                direction = { x: 1, y: 0 };
            }
            else if (animationDirection === 'verticalTop' ||
                animationDirection === 'verticalDown' ||
                animationDirection === 'diagonalDownLeft') {
                direction = { x: 0, y: 1 };
            }
            else if (animationDirection === 'diagonalTopLeft') {
                direction = { x: 0, y: 0 };
            }
            else if (animationDirection === 'diagonalDownRight') {
                direction = { x: 1, y: 1 };
            }
        }
        return direction;
    };
    const getBoneStyles = (boneLayout) => {
        const boneStyle = Object.assign({ width: boneLayout.width || 0, height: boneLayout.height || 0, borderRadius: boneLayout.borderRadius || Constants_1.DEFAULT_BORDER_RADIUS }, boneLayout);
        if (animationType !== 'pulse') {
            boneStyle.overflow = 'hidden';
            boneStyle.backgroundColor = boneLayout.backgroundColor || boneColor;
        }
        return boneStyle;
    };
    const getStaticBoneStyles = (boneLayout) => {
        const pulseStyles = [
            getBoneStyles(boneLayout),
            {
                backgroundColor: react_native_redash_1.interpolateColor(animationValue, {
                    inputRange: [0, 1],
                    outputRange: [boneColor, highlightColor]
                })
            }
        ];
        if (animationType === 'none')
            pulseStyles.pop();
        return pulseStyles;
    };
    const getPositionRange = (boneLayout) => {
        const outputRange = [];
        // use layout dimensions for percentages (string type)
        const boneWidth = typeof boneLayout.width === 'string'
            ? componentSize.width || 0
            : boneLayout.width || 0;
        const boneHeight = typeof boneLayout.width === 'string'
            ? componentSize.height || 0
            : boneLayout.height || 0;
        if (animationDirection === 'horizontalRight' ||
            animationDirection === 'diagonalDownRight' ||
            animationDirection === 'diagonalTopRight') {
            outputRange.push(-boneWidth, +boneWidth);
        }
        else if (animationDirection === 'horizontalLeft' ||
            animationDirection === 'diagonalDownLeft' ||
            animationDirection === 'diagonalTopLeft') {
            outputRange.push(+boneWidth, -boneWidth);
        }
        else if (animationDirection === 'verticalDown') {
            outputRange.push(-boneHeight, +boneHeight);
        }
        else if (animationDirection === 'verticalTop') {
            outputRange.push(+boneHeight, -boneHeight);
        }
        return outputRange;
    };
    const getGradientTransform = (boneLayout) => {
        let transform = {};
        const interpolatedPosition = react_native_reanimated_1.interpolate(animationValue, {
            inputRange: [0, 1],
            outputRange: getPositionRange(boneLayout)
        });
        if (animationDirection !== 'verticalTop' &&
            animationDirection !== 'verticalDown') {
            transform = { translateX: interpolatedPosition };
        }
        else {
            transform = { translateY: interpolatedPosition };
        }
        return transform;
    };
    const getBoneContainer = (layoutStyle, bonesChildren, key) => (<react_native_1.View key={layoutStyle.key || key} style={layoutStyle}>
      {bonesChildren}
    </react_native_1.View>);
    const getStaticBone = (layoutStyle, key) => (<react_native_reanimated_1.default.View key={layoutStyle.key || key} style={getStaticBoneStyles(layoutStyle)}/>);
    const getShiverBone = (layoutStyle, key) => {
        const animatedStyle = {
            transform: [getGradientTransform(layoutStyle)]
        };
        return (<react_native_1.View key={layoutStyle.key || key} style={getBoneStyles(layoutStyle)}>
        <react_native_reanimated_1.default.View style={[styles.absoluteGradient, animatedStyle]}>
          <react_native_linear_gradient_1.default colors={[boneColor, highlightColor, boneColor]} start={getGradientStartDirection()} end={getGradientEndDirection()} style={styles.gradientChild}/>
        </react_native_reanimated_1.default.View>
      </react_native_1.View>);
    };
    const getBones = (bonesLayout, childrenItems, prefix = '') => {
        if (bonesLayout && bonesLayout.length > 0) {
            const iterator = new Array(bonesLayout.length).fill(0);
            return iterator.map((_, i) => {
                // has a nested layout
                if (bonesLayout[i].children && bonesLayout[i].children.length > 0) {
                    const containerPrefix = bonesLayout[i].key || `bone_container_${i}`;
                    const _a = bonesLayout[i], { children: bonesChildren } = _a, layoutStyle = __rest(_a, ["children"]);
                    return getBoneContainer(layoutStyle, getBones(bonesChildren, [], containerPrefix), containerPrefix);
                }
                if (animationType === 'pulse' || animationType === 'none') {
                    return getStaticBone(bonesLayout[i], prefix ? `${prefix}_${i}` : i);
                }
                return getShiverBone(bonesLayout[i], prefix ? `${prefix}_${i}` : i);
            });
            // no layout, matching children's layout
        }
        return React.Children.map(childrenItems, (child, i) => {
            const styling = child.props.style || {};
            if (animationType === 'pulse' || animationType === 'none') {
                return getStaticBone(styling, i);
            }
            return getShiverBone(styling, i);
        });
    };
    return (<react_native_1.View style={containerStyle} onLayout={onLayout}>
      {isLoading ? getBones(layout, children) : children}
    </react_native_1.View>);
};
exports.default = React.memo(SkeletonContent);
