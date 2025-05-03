import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import UserIdCard from '@/components/UserIdCard';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('screen');
const NUM_CARDS = 5;
const CARD_GAP = 8; // margin: 4 on each side = 8 total
const SIDE_PADDING = 40; // 20 left + 20 right from styles.container

const totalGapWidth = CARD_GAP * (NUM_CARDS - 1);
const availableWidth = width - SIDE_PADDING - totalGapWidth;
const cardSize = availableWidth / NUM_CARDS;


type SlideImage = {
  id: number;
  image: any;
};

const slideImages: SlideImage[] = [
  { id: 1, image: require('@/assets/images/homelogo.png') },
  { id: 2, image: require('@/assets/images/react-logo.png') },
  { id: 3, image: require('@/assets/images/homelogo.png') }
];

const categories = [
  'Powerbank', 'Headphones', 'Speakers', 'Smartwatches', 'Tablets', 'Gaming Consoles',
  'Phone Cases', 'Portable Mini Fan', 'Bluetooth Earpiece', 'Wireless Mouse', 'Webcam Cover',
  'Digital Alarm Clock', 'Magnetic Phone Mount', 'Car Phone Holder'
];

const codes = Array.from({ length: 26 }, (_, i) =>
  Array.from({ length: 9 }, (_, j) => `${String.fromCharCode(65 + i)}${j + 1}`)
).flat();

const HomeScreen = () => {
  const flatListRef = useRef<FlatList<string>>(null);
  const bannerRef = useRef<FlatList<SlideImage>>(null);

  const [activeDot, setActiveDot] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => {
        const next = (prev + 1) % slideImages.length;
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getItemLayout = (_: any, index: number) => ({
    length: width - 40,
    offset: (width - 40) * index,
    index
  });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 40));
    setActiveDot(index);
  };

  const renderDotIndicator = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
      {slideImages.map((_, index) => (
        <View
          key={index}
          style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: activeDot === index ? '#061023' : 'white',
            marginHorizontal: 5
          }}
        />
      ))}
    </View>
  );

  const renderBannerItem: ListRenderItem<SlideImage> = ({ item }) => (
    <Image source={item.image} style={{ width: width - 40, height: 230, borderRadius: 10 }} resizeMode="stretch" />
  );

  // const renderCodeItem: ListRenderItem<string> = ({ item }) => {
  //   const isRaffled = item.includes('1');
  //   return (
  //     <TouchableOpacity
  //       style={[
  //         {
  //           width: cardSize,
  //           height: cardSize,
  //           margin: 4
  //         },
  //         styles.rafCard,
  //         isRaffled && styles.raffledCard
  //       ]}
  //     >
  //       <Text style={isRaffled ? styles.raffledText : styles.normalText}>
  //         {isRaffled ? 'Raffled' : item}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };
  const CodeCard = React.memo(({ item }: { item: string }) => {
    const isRaffled = item.includes('1');
    return (
      <TouchableOpacity
        style={[
          {
            width: cardSize,
            height: cardSize,
            margin: 4
          },
          styles.rafCard,
          isRaffled && styles.raffledCard
        ]}
      >
        <Text style={isRaffled ? styles.raffledText : styles.normalText}>
          {isRaffled ? 'Raffled' : item}
        </Text>
      </TouchableOpacity>
    );
  });
  const renderCodeItem: ListRenderItem<string> = ({ item }) => <CodeCard item={item} />;
  

  const renderHeader = () => (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Image source={require('@/assets/images/homelogo.png')} style={{ width: 40, height: 40 }} />
        <UserIdCard />
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.catItem, selectedCategory === index && { backgroundColor: '#D23433' }]}
            onPress={() => setSelectedCategory(index)}
          >
            <Text style={{ color: selectedCategory === index ? '#fff' : '#000' }}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.categoryStyle}
        showsHorizontalScrollIndicator={false}
      />

      {/* Banner */}
      <FlatList
        ref={bannerRef}
        data={slideImages}
        renderItem={renderBannerItem}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        getItemLayout={getItemLayout}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      />

      {renderDotIndicator()}

      {/* Random Select Row */}
      <View style={styles.randomRow}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{categories[selectedCategory]}</Text>
        <TouchableOpacity style={styles.randomBtn}>
          <Text style={{ color: Colors.light.primary }}>Random Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          data={codes}
          ref={flatListRef}
          keyExtractor={(item) => item}
          numColumns={5}
          renderItem={renderCodeItem}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16
  },
  categoryStyle: {
    paddingVertical: 8,
    gap: 6
  },
  catItem: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginRight: 8
  },
  randomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16
  },
  randomBtn: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14
  },
  raffleContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center'
  },
  rafCard: {
    backgroundColor: '#449444',
    alignItems: 'center',
    justifyContent: 'center'
  },
  normalText: {
    fontSize: 18,
    color: '#fff'
  },
  raffledCard: {
    backgroundColor: '#F1C0C0'
  },
  raffledText: {
    transform: [{ rotate: '-60deg' }],
    fontSize: 16,
    color: '#952524',
    textAlign: 'center'
  }
});
