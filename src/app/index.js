import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
export default function HomeScreen() {
  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/images/welcome.png')}
      resizeMode="cover"
    >
      <View style={styles.content}>
        <Animated.Text style={styles.title} entering={FadeInDown.delay(200).springify()} exiting={FadeOut}>
          AuraMove
        </Animated.Text>
        <Animated.Text style={styles.subtitle} entering={FadeInDown.delay(300).springify()} exiting={FadeOut}>
          Your Ultimate Fitness Companion
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(400).springify()} exiting={FadeOut}>
          <Link href="/fitnessView/exercises" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Get Started</Text>
            </Pressable>
          </Link>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // Add a subtle overlay to make text more readable
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: 'rgba(0, 123, 255, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});