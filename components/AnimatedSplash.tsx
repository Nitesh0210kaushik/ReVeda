import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedSplashProps {
    onAnimationFinish: () => void;
}

export default function AnimatedSplash({ onAnimationFinish }: AnimatedSplashProps) {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Sequence: Wait a bit, then scale up and fade out
        Animated.sequence([
            Animated.delay(1000), // Hold for 1 second
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 5, // Zoom in effect
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            onAnimationFinish();
        });
    }, [fadeAnim, scaleAnim, onAnimationFinish]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.imageContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                <Image
                    source={require('../assets/images/reveda_logo.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999, // Ensure it stays on top
    },
    imageContainer: {
        width: width * 0.4, // Matches native splash size approximately
        height: width * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
