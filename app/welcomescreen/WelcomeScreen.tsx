import React, { useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { View, Text, Image, Dimensions, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';

import styles from '../../style/WelcomeScreen.styles';

const { width } = Dimensions.get('window');

type Slide = {
    id: string;
    title: string;
    subtitle: string;
    image: any; // require or URL
    caption: string;
};

const slides: Slide[] = [
    {
        id: '1',
        title: 'Welcome to',
        subtitle: 'Fresh vegetables at your doorstep.',
        image: { uri: 'https://plus.unsplash.com/premium_photo-1738908521678-bc684edb8847?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1pbi1zYW1lLXNlcmllc3wyfHx8ZW58MHx8fHx8' },
        caption: 'Organic & Healthy',
    },
    {
        id: '2',
        title: 'Discover',
        subtitle: 'Variety of fruits and available.',
        image: { uri: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500&auto=format&fit=crop&q=60' },
        caption: 'Handpicked for You',
    },
    {
        id: '3',
        title: 'Fast Delivery',
        subtitle: 'Delivered in 30 minutes at your door.',
        image: { uri: 'https://plus.unsplash.com/premium_photo-1682309577365-36a60de32dd6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDM4fHx8ZW58MHx8fHx8' },
        caption: 'Lightning Fast',
    },
    {
        id: '4',
        title: 'Easy Payments',
        subtitle: 'Pay online or cash on delivery.',
        image: { uri: 'https://plus.unsplash.com/premium_photo-1681433370812-e5268b32b9fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D' },
        caption: 'Secure Checkout',
    },
    {
        id: '5',
        title: 'Track Orders',
        subtitle: 'Real-time order tracking made easy.',
        image: { uri: 'https://plus.unsplash.com/premium_photo-1681488350342-19084ba8e224?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b25saW5lJTIwb3JkZXJ8ZW58MHx8MHx8fDA%3D' },
        caption: 'Stay Updated',
    },
    {
        id: '6',
        title: 'Get Started Now',
        subtitle: 'Let’s begin your journey with us!',
        image: { uri: 'https://images.unsplash.com/photo-1516230174591-5efa976a387a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGdldCUyMHN0YXJ0ZWQlMjBmb29kfGVufDB8fDB8fHww' },
        caption: 'Join the Family',
    },
];


type WelcomeScreenProps = {
    onDone: () => void;
};


const WelcomeScreen = ({ onDone }: WelcomeScreenProps) => {
    const scrollViewRef = useRef<ScrollView>(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const handleNext = async () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < slides.length) {
            scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
            setCurrentIndex(nextIndex);
        } else {
            onDone(); // 👈 go to main app

            // router.replace('/');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
            >
                {slides.map((slide) => (
                    <View key={slide.id} style={styles.slide}>
                        <Text style={styles.title}>{slide.title}</Text>
                        <Text style={styles.subtitle}>{slide.subtitle}</Text>
                        <Image source={slide.image} style={styles.image} resizeMode="contain" />
                        <Text style={styles.caption}>{slide.caption}</Text>
                    </View>
                 

                ))}

            </ScrollView>

            {/* Page Indicator Dots */}
            <View style={styles.indicatorContainer}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            currentIndex === index && styles.activeIndicator,
                        ]}
                    />
                ))}
            </View>

            {/* Next Button */}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>
                    {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default WelcomeScreen;


