
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Pagination from '@cherry-soft/react-native-basic-pagination';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack } from 'expo-router';
import { apiGetResults } from '@/services/GameService';
import { IGameResult, IResponseData } from '@/interfaces';
import useFetch from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { useSorting } from '@/hooks/useSorting';
import { Colors } from '@/constants/Colors';

const DATA = Array.from({ length: 20 }).map((_, i) => ({
  id: i.toString(),
  gameId: i % 2 === 0 ? 'RN-123460' : 'RN-000123',
  gamePlayed: 'PowerBank',
  phoneNumber: '080******32',
  stake: '100 NGN',
  time:'1 min ago',
  status: i % 2 === 0 ? 'Lost' : 'Won',
  
}));

const GameRow = ({ item }: { item: IGameResult }) => (
  <View style={[styles.row, styles.won ]}>
    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Game ID</Text>
      <Text style={styles.value}>{item.game_id}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Game Played</Text>
      <Text style={styles.value}>{item.item_name}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Phone Number</Text>
      <Text style={styles.value}>{item.phone_number?.slice(0,3)}*****{item.phone_number?.slice(-3)}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Total Stake</Text>
      <Text style={styles.value}>{item.stake}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Status</Text>
      <Text style={[styles.value, item.status === 'won' ? styles.statusWon : styles.statusLost]}>{item.status}</Text>
    </View>

    {/* <TouchableOpacity
      style={[styles.swapButton, item.status === 'Lost' && styles.swapButtonDisabled]}
      disabled={item.status === 'Lost'}>
      <Text style={styles.swapText}>Swap Item</Text>
    </TouchableOpacity> */}
  </View>
);

const GameResults=()=> {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTxt, setSearchTxt] = useState("")
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const dateRef = useRef<null | HTMLInputElement>(null)
    
  const { limit, onPaginationChange, page, pagination } = usePagination();
  const { sorting, onSortingChange, field, order } = useSorting();

  const { data: results, isLoading } = useFetch<IResponseData<IGameResult[]>>({
      api: apiGetResults,
      key: ["game-results", String(pagination.pageIndex)],
      param: {
          page: pagination.pageIndex + 1,
          // type: activeTab
      },
      // requireAuth: true
  })
  
  return (
    <>
    <Stack.Screen
      options={{
        title: 'Game Results',
      }}
    />
    {/* <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}> */}
      <View style={styles.container}>
        {/* <Text style={styles.header}>Games Result</Text> */}

        

        {/* <Text style={styles.timestamp}>21/12/2023 10:20pm</Text> */}
        
        {/* Date and search input */}
        <View style={styles.searchFilterRow}>
          <TextInput 
            style={styles.input} placeholder="Search for Game ID"
            value={searchTxt} onChangeText={(txt)=>setSearchTxt(txt)} 
          />
          {
            searchTxt.length>0?
          <TouchableOpacity 
            style={styles.dateFilter} onPress={()=>setSearchTxt("")}>
            <Text style={styles.dateFilterText}>Search</Text>
          </TouchableOpacity>:
          <TouchableOpacity 
            style={styles.dateFilter} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateFilterText}>Pick Date</Text>
          </TouchableOpacity>
          }
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <ScrollView horizontal>
          <ScrollView style={{ width: '100%' }}>
              {
                (!results?.data || !results?.data?.length)
                ? 
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 20
                }} className='text-center'>
                  {
                  isLoading ? 
                    <ActivityIndicator size="large" color={Colors.light.primary} />
                    :
                    <Text>No result</Text>
                  }
              
                </View>
                :
              results?.data?.map(item => (
              <GameRow item={item} key={item.game_id} />
            ))}
          </ScrollView>
        </ScrollView>
        {
            Number(results?.count || 0) > limit &&
              <Pagination
                totalItems={Number(results?.count || 0)}
                pageSize={limit}
                currentPage={page}
                onPageChange={onPaginationChange}
                activeBtnStyle={{backgroundColor:'#449444', borderWidth:0, borderRadius:4}}
                activeTextStyle={{color:"#fff"}}
                btnStyle={{backgroundColor:"trasparent"}}
                textStyle={{color:"black"}}
              />
            }
      </View>
    {/* </SafeAreaView> */}
    </>
  );
}
export default GameResults;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tabRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tabText: {
    marginRight: 15,
    fontSize:18,
    color: '#888',
  },
  tabActive: {
    color: '#2cb371',
    borderBottomWidth: 2,
    borderColor: '#2cb371',
  },
  timestamp: {
    marginBottom: 10,
    color: '#444',
  },
  searchFilterRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
  },
  dateFilter: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
  },
  dateFilterText: {
    color: '#333',
  },
  row: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    minWidth: 400,
    flexDirection:"row"
  },
  cell: {
    minWidth: 150,
    paddingHorizontal: 8,
    fontSize: 14,
    gap:6
  },
  rowItem: {
    marginBottom: 5,
    width: 150
  },
  label: {
    fontSize: 12,
    color: '#777',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusLost: {
    color: '#c00',
  },
  statusWon: {
    color: '#2cb371',
  },
  won: {
    backgroundColor: '#e5f9ec',
  },
  lost: {
    backgroundColor: '#f5f5f5',
  },
  swapButton: {
    backgroundColor: '#2cb371',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  swapButtonDisabled: {
    backgroundColor: '#ccc',
  },
  swapText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageButton: {
    padding: 8,
    margin: 2,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  activePageButton: {
    backgroundColor: '#d00',
  },
  pageText: {
    color: '#000',
  },
  activePageText: {
    color: '#fff',
  },
});