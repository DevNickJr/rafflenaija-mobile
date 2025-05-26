import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { SafeView } from '@/components/SafeView';
import { ICategory, IGame, IImage, IRaffleTicket, IResponseData, ITicket, IUser } from '@/interfaces';
import useFetch from '@/hooks/useFetch';
import { apiGetCategories, apiGetGames } from '@/services/GameService';
import { Entypo } from '@expo/vector-icons';
// import ModalComponent from '@/components/ModalComponent';
import RaffleModal from '@/components/RaffleModal';
import { useSession } from '@/providers/SessionProvider';
import { apiGetUser } from '@/services/AuthService';
import Toast from 'react-native-toast-message';
import Profile from '@/components/Profile';
import ImageGalleryModal from '@/components/ImageGalleryModal';
import Banner from '@/components/Banner';

const { width } = Dimensions.get('screen');
const NUM_CARDS = 5;
const CARD_GAP = 8; // margin: 4 on each side = 8 total
const SIDE_PADDING = 20; // 20 left + 20 right from styles.container

const totalGapWidth = CARD_GAP * (NUM_CARDS - 1);
const availableWidth = width - SIDE_PADDING - totalGapWidth;
const cardSize = availableWidth / NUM_CARDS;

const dynamicFontSize = Math.max(10, Math.min(cardSize * 0.2, 18));

const codes = Array.from({ length: 26 }, (_, i) =>
  Array.from({ length: 9 }, (_, j) => `${String.fromCharCode(65 + i)}${j + 1}`),
).flat();

const HomeScreen = () => {
  const { dispatch, access_token, refresh_token, ...context } = useSession()
  const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>()
  const [showImageModal, setShowImageModal]=useState(false)
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

  useEffect(() => {
    if (categories?.data) {
        setSelectedCategory(categories?.data[0])
      }
  }, [categories]);


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
  const [images, setImages] = useState<IImage[]>([])


  const handleOpenImageModal = (images: IImage[]) => {
    setImages(images)
    setShowImageModal(true)
  }
 
  const CodeCard = React.memo(({ item, index }: { item: ITicket & { price: string }; index: number; }) => {
    const isRaffled = item.status != "active";

    return (
      <TouchableOpacity
        onPress={() => !isRaffled ? handleRaffle(item.code, item.price) : Toast.show({ type: 'info', text1: 'This card has already been raffled' })}
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

  const renderHeader = () => (
    <View style={{ backgroundColor: '#f4f7f9', paddingHorizontal: 10 }}>
      <Profile />

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
  // const renderBanner = () => (
  //  <>
  //        {/* Banner */}
    
  //  </>
  // );

  return (
    <SafeView style={{ backgroundColor:"#f4f7f9" }}>
    {/* <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS==="android" ? 20 : 0 }}> */}
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.container}>
        <>
          <Banner />
          {
              isLoadingGames?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: 100 }}>
                  <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 20 }} />
                </View>
                :
            games?.data?.map((game, index) => 
              <View key={index}>
                 {/* Random Select Row */}
                <View style={styles.randomRow}>
                  <Text style={{ fontSize: 16, fontWeight: '600', flexShrink: 1 }}>{selectedCategory?.name} - {game.name}</Text>
                  {/* <TouchableOpacity style={styles.randomBtn}>
                    <Text style={{ color: Colors.light.primary }}>Random Select</Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity 
                    style={{flexDirection:"row",gap:6,alignItems:"center"}}
                    onPress={()=>handleOpenImageModal(game?.images)}
                  >
                    <Entypo name="camera" size={16} color="#449444" />
                    <Text style={{color:"#449444", fontSize:16, fontWeight:"600"}}>View Item Image</Text>
                  </TouchableOpacity>
                </View>            
                {
                  game?.raffles[0]?.tickets?.length > 0 ? 
                  <View style={styles.raffleContainer}>
                    {
                      game?.raffles[0]?.tickets?.map((ticket, index) => (
                        <CodeCard item={{
                          ...ticket,
                          price: game?.raffles[0]?.ticket_price
                        }} index={index} key={index}/>
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

     <ImageGalleryModal
        showImageModal={showImageModal}
        setShowImageModal={setShowImageModal}
        images={images}
        setImages={setImages}
     />

      {/* <ModalComponent
        visible={showNotifyModal}
        title='Are you sure you want to raffle the Card?'
        content='You are about to pay to raffle the card'
        titleSize={20}
        boldTxt={`₦${1000.00}`}
        onCancel={() => setShowNotifyModal(false)}
        onConfirm={()=>{}}
      /> */}
      <RaffleModal
        visible={!!ticket}
        onClose={() => setTicket(null)}
        refetchGames={refetchGames}
        refetchUser={refetchUser}
        raffle={ticket}
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
    gap: 20,
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
    fontSize: dynamicFontSize,
    color: '#952524',
    textAlign: 'center',
  },
  modalContainer:{
    flex:1,
    backgroundColor:"rgba(0,0,0,0.6)"
  },
  modalInnerWrapper:{
    flex:1, 
    alignItems:"center",
    justifyContent:"center",
    gap:20
  },
  modalImgBtn:{
    // borderColor:"#c0c0c0",
    padding:2,
    borderRadius:4
  },
  modalTopNNav:{
    marginTop: Platform.OS==="android"?10:60,
    paddingHorizontal:20,
    flexDirection:"row",
    justifyContent:"flex-end"
  }
});
