import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { bodyParts } from '@constants/image_path';

import { useRouter, Stack } from 'expo-router';

export default function BodyParts(){
    const router = useRouter();
    
    return (
        <>
        <Stack.Screen
            options={{
                // Set a dynamic, user-friendly title instead of the file path
                title: 'Exercises'
            }}
        />
        <View style={styles.container}>
            <Text style={[styles.headerText, { fontSize: hp(3) }]}>
                Body Parts
            </Text>
            <FlatList
                data={bodyParts}
                numColumns={2}
                keyExtractor={item => item.name}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={{
                    justifyContent: 'space-between'
                }}
                renderItem={({item, index}) => <BodyPartCard index={index} item={item} />}
            />
        </View>
        </>
    )
}

const BodyPartCard = ({item, index}) => {
    const router = useRouter();
    
    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({
                pathname: '/authView/fitnessView/exerciseByBodyParts', 
                params: { name: item.name }
            })}
        >
            <Image
                source={item.image}
                resizeMode="cover"
                style={styles.cardImage}
            />

            <Text style={styles.cardText}>{item.name}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
    },
    headerText: {
        fontWeight: '600', // Equivalent to 'font-semibold'
        color: '#404040', // Equivalent to 'text-neutral-700',
        marginBottom: 12,
    },
    listContainer: {
        paddingBottom: 50,
    },
    card: {
        width: wp(44),
        height: wp(52),
        justifyContent: 'flex-end',
        padding: 16,
        marginBottom: 16,
    },
    cardImage: {
        width: wp(44),
        height: wp(52),
        borderRadius: 20,
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    cardText: {
        fontSize: hp(2.3),
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});