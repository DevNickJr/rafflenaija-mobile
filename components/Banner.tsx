import {
    View,
    Image,
    FlatList,
    ListRenderItem,
    NativeScrollEvent,
    NativeSyntheticEvent,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { IBanner, IResponseData } from '@/interfaces';
import useFetch from '@/hooks/useFetch';
import { apiGetBannerItems } from '@/services/AdminService';
import { Dimensions } from 'react-native';
  const { width } = Dimensions.get('screen');

const Banner = () => {
    const bannerRef = useRef<FlatList<IBanner>>(null);
    const [activeDot, setActiveDot] = useState(0);
    const { data: banners } = useFetch<IResponseData<IBanner[]>>({
        api: apiGetBannerItems,
        key: ["banners"],
    })

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / (width));
        setActiveDot(index);
    };

    const getItemLayout = (_: any, index: number) => ({
        length: width,
        offset: (width) * index,
        index,
      });
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
    }, [banners?.data]);


    const renderBannerItem: ListRenderItem<IBanner> = ({ item }) => (
        <Image
          src={item.image}
          style={{ width: width, height: 210, borderRadius: 10, backgroundColor: 'black' }}
          resizeMode="stretch"
        />
      );
      
      if (!banners?.data?.length) return null
    return (
        <>
        <View>
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
        </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                {banners?.data?.map((_, index) => (
                    <View
                    key={index}
                    style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: activeDot === index ? '#061023' : 'gray',
                        marginHorizontal: 5,

                    }}
                    />
                ))}
            </View>
        </>
    )
}

export default Banner