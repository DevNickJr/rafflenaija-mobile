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
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import UserIdCard from '@/components/UserIdCard';
import { Colors } from '@/constants/Colors';
import { SafeView } from '@/components/SafeView';
import { IBanner, ICategory, IGame, IRaffleTicket, IResponseData, ITicket, IUser } from '@/interfaces';
import useFetch from '@/hooks/useFetch';
import { apiGetCategories, apiGetGames } from '@/services/GameService';
import { apiGetBannerItems } from '@/services/AdminService';
import RaffleModal from '@/components/RaffleModal';
import { useSession } from '@/providers/SessionProvider';
import { apiGetUser } from '@/services/AuthService';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('screen');
const NUM_CARDS = 5;
const CARD_GAP = 8; // margin: 4 on each side = 8 total
const SIDE_PADDING = 20; // 20 left + 20 right from styles.container

const totalGapWidth = CARD_GAP * (NUM_CARDS - 1);
const availableWidth = width - SIDE_PADDING - totalGapWidth;
const cardSize = availableWidth / NUM_CARDS;


// const slideImages: IBanner[] = [
//   { id: 1, image: require('@/assets/images/favicon.png') },
//   { id: 2, image: require('@/assets/images/react-logo.png') },
//   { id: 3, image: require('@/assets/images/homelogo.png') },
// ];

// const categories = [
//   'Powerbank',
//   'Headphones',
//   'Speakers',
//   'Smartwatches',
//   'Tablets',
//   'Gaming Consoles',
//   'Phone Cases',
//   'Portable Mini Fan',
//   'Bluetooth Earpiece',
//   'Wireless Mouse',
//   'Webcam Cover',
//   'Digital Alarm Clock',
//   'Magnetic Phone Mount',
//   'Car Phone Holder',
// ];

const codes = Array.from({ length: 26 }, (_, i) =>
  Array.from({ length: 9 }, (_, j) => `${String.fromCharCode(65 + i)}${j + 1}`),
).flat();

const HomeScreen = () => {
  const { dispatch, access_token, refresh_token, ...context } = useSession()
  // const flatListRef = useRef<FlatList<string>>(null);
  const bannerRef = useRef<FlatList<IBanner>>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>()

  const { data: categories } = useFetch<IResponseData<ICategory[]>>({
    api: apiGetCategories,
    key: ["categories"],
  })

  const { data: user, refetch: refetchUser } = useFetch<IResponseData<IUser>>({
    api: apiGetUser,
    key: ["user"],
    requireAuth: true,
    enabled: !!access_token,
    showMessage: false
  })

  useEffect(() => {
    if (access_token && user?.data) {
      dispatch({ type: "LOGIN", payload: {
        access_token: access_token,
        refresh_token: refresh_token,
        wallet_balance: user?.data?.wallet_balance || "",
        phone_number: user?.data?.phone_number || "",
        first_name: user?.data?.first_name || "",
        last_name: user?.data?.last_name || "",
        email: user?.data?.email || "",
        is_verified: user?.data?.is_verified || false,
        dob: user?.data?.dob || "",
        gender: user?.data?.gender || "",
        profile_picture: user?.data?.profile_picture || "",
      }})
    }
  },[user, dispatch, access_token, refresh_token])

  const { data: games, isLoading: isLoadingGames, refetch: refetchGames } = useFetch<IResponseData<IGame[]>>({
    api: apiGetGames,
    key: ["games", selectedCategory?.id || ""],
    param: selectedCategory?.id,
    enabled: !!selectedCategory?.id
  })

  const { data: banners } = useFetch<IResponseData<IBanner[]>>({
    api: apiGetBannerItems,
    key: ["banners"],
  })
  
  useEffect(() => {
    if (categories?.data) {
        setSelectedCategory(categories?.data[0])
      }
  }, [categories]);

  // Auto-slide logic
  useEffect(() => {
    if (!banners?.data?.length) return;
    const interval = setInterval(() => {
      setActiveDot((prev) => {
        const next = (prev + 1) % (banners?.data?.length || 1);
        bannerRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getItemLayout = (_: any, index: number) => ({
    length: width - 40,
    offset: (width - 40) * index,
    index,
  });

  const [ticket, setTicket] = useState<IRaffleTicket | null>(null)
      
  const handleRaffle = (code: string, price: string) => {
    if (!context.is_logged_in) {
      return Toast.show({
        type: 'info',
        text1: 'Your session has expired'
      })
    }
    setTicket({ code, price })
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width - 40));
    setActiveDot(index);
  };

  const renderDotIndicator = () => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
      {banners?.data?.map((_, index) => (
        <View
          key={index}
          style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: activeDot === index ? '#061023' : 'white',
            marginHorizontal: 5,
          }}
        />
      ))}
    </View>
  );

  const renderBannerItem: ListRenderItem<IBanner> = ({ item }) => (
    <Image
      src={item.image}
      style={{ width: width - 40, height: 210, borderRadius: 10 }}
      resizeMode="stretch"
    />
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
  const CodeCard = React.memo(({ item, index }: { item: ITicket & { price: string }; index: number; }) => {
    const isRaffled = item.status != "active";
    return (
      <TouchableOpacity
        onPress={() => handleRaffle(item.code, item.price)}
        style={[
          {
            width: cardSize,
            height: cardSize,
            // margin: CARD_GAP/2,
            // marginLeft: index % NUM_CARDS === 0 ? 0 : CARD_GAP/2,
            // marginRight: index % NUM_CARDS === (NUM_CARDS-1) ? 0 : CARD_GAP/2
          },
          styles.rafCard,
          isRaffled && styles.raffledCard,
        ]}>
        <Text style={isRaffled ? styles.raffledText : styles.normalText}>
          {item.is_winner ? 'WON' : isRaffled ? 'Raffled' :  codes[index] ?? index}
        </Text>
      </TouchableOpacity>
    );
  });
  const renderCodeItem = ({ item, index }: { item: ITicket & { price: string }; index: number }) => <CodeCard item={item} index={index} />;
  // const renderCodeItem: ListRenderItem<ITicket> = ({ item, index }) => <CodeCard item={item} index={index} />;

  const renderHeader = () => (
    <View style={{ backgroundColor: '#f4f7f9', paddingHorizontal: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <Image source={require('@/assets/images/homelogo.png')} style={{ width: 40, height: 40 }} />
        <UserIdCard />
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={categories?.data}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.catItem, selectedCategory?.id === item?.id && { backgroundColor: '#D23433' }]}
            onPress={() => setSelectedCategory(item)}>
            <Text style={{ color: selectedCategory?.id === item?.id  ? '#fff' : '#000' }}>{item?.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        contentContainerStyle={styles.categoryStyle}
        showsHorizontalScrollIndicator={false}
      />

      {/* Random Select Row */}
      {/* <View style={styles.randomRow}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{selectedCategory?.name}</Text>
        <TouchableOpacity style={styles.randomBtn}>
          <Text style={{ color: Colors.light.primary }}>Random Select</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
  const renderBanner = () => (
   <>
         {/* Banner */}
      <FlatList
        ref={bannerRef}
        data={banners?.data || []}
        renderItem={renderBannerItem}
        horizontal
        keyExtractor={(item, i) => `${item.id}-${i}`}
        pagingEnabled
        getItemLayout={getItemLayout}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      />

      {renderDotIndicator()}
   </>
  );

  return (
    <SafeView style={{ backgroundColor:"#f4f7f9" }}>
    {/* <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS==="android" ? 20 : 0 }}> */}
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.container}>
        <>
          {renderBanner()}
          {
              isLoadingGames?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 100 }}>
                  <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 20 }} />
                </View>
                :
                games?.data?.map((game, index) => 
                  <View key={`${game.id}-${index}`}>
                      {/* Random Select Row */}
                      <View style={styles.randomRow}>
                        <Text style={{ fontSize: 16, fontWeight: '600', maxWidth: '60%' }}>{selectedCategory?.name} - {game.name}</Text>
                        <TouchableOpacity style={styles.randomBtn}>
                          <Text style={{ color: Colors.light.primary }}>Random Select</Text>
                        </TouchableOpacity>
                      </View>            
                    {
                      game?.raffles[0]?.tickets?.length > 0 ? 
                      <View style={styles.raffleContainer}>
                        {
                          game?.raffles[0]?.tickets?.map((ticket, index) => (
                            <CodeCard key={`${ticket?.code}-${index}`} item={{
                              ...ticket,
                              price: game.raffles[0].ticket_price,
                            }} index={index} />
                          ))
                      }
                      </View>
                      :
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 100 }}>
                        <Text>No raffles available</Text>
                      </View>
                  }
                    {/* <FlatList
                      data={game?.raffles[0]?.tickets || []}
                      // ref={flatListRef}
                      keyExtractor={(item, index) => `${item?.code}-${index}`}
                      numColumns={5}
                      renderItem={renderCodeItem}
                      // ListHeaderComponent={renderHeader}
                      contentContainerStyle={{ paddingBottom: 40 }}
                      showsVerticalScrollIndicator={false}
                    /> */}
                  </View>
                  )
          }
        </>
      </ScrollView>
      <RaffleModal
        visible={!!ticket?.code}
        onClose={() => setTicket(null)}
        raffle={ticket}
        refetchGames={refetchGames}
        refetchUser={refetchUser}
      />
    </SafeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexGrow: 1,
    paddingBottom: 20,
    // paddingLeft: SIDE_PADDING/2,
    paddingHorizontal: 10,
    backgroundColor: '#f4f7f9',
  },
  categoryStyle: {
    paddingVertical: 8,
    gap: 6,
  },
  catItem: {
    // backgroundColor: '#f0f0f0',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  randomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    alignItems: 'center',
    marginTop: 20,
  },
  randomBtn: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  raffleContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  rafCard: {
    backgroundColor: '#449444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalText: {
    fontSize: 18,
    color: '#fff',
  },
  raffledCard: {
    backgroundColor: '#F1C0C0',
  },
  raffledText: {
    transform: [{ rotate: '-60deg' }],
    fontSize: 16,
    color: '#952524',
    textAlign: 'center',
  },
});
