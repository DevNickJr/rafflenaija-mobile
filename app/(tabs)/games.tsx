
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Pagination from '@cherry-soft/react-native-basic-pagination';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { usePagination } from '@/hooks/usePagination';
import { useSorting } from '@/hooks/useSorting';
import useFetch from '@/hooks/useFetch';
import { IHistory, IResponseData } from '@/interfaces';
import { apiGetHistory, apiSwap } from '@/services/GameService';
import useMutate from '@/hooks/useMutation';
import Toast from 'react-native-toast-message';
import { Colors } from '@/constants/Colors';

const GameRow = ({ item, handleSwap }: { item: IHistory; handleSwap: (id: string) => void }) => (
  <View style={[styles.row, item.status === 'Won' ? styles.won : styles.lost]}>
    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Game Played</Text>
      <Text style={styles.value}>{item.item_name}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Game ID</Text>
      <Text style={styles.value}>{item.ticket_code}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Total Stake</Text>
      <Text style={styles.value}>{item.stake}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Status</Text>
      <Text style={[styles.value, (item?.status === "won")? styles.statusWon : styles.statusLost]}>{item.status}</Text>
    </View>

    <TouchableOpacity
      onPress={() => handleSwap(item.id || '')}
      style={[styles.swapButton, (item?.status != "won" || !item?.is_paid) && styles.swapButtonDisabled]}
      disabled={item.status != 'won'}>
      <Text style={styles.swapText}>Swap Item</Text>
    </TouchableOpacity>
  </View>
);

const Game =() => {
  const [activeTab, setActiveTab] = useState<"finished" | "pending" | "">("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [dateModalOpen, setDateModalOpen] = useState(false)

  const [swapId, setSwapId] = useState("")

  const handleSwap = (id: string) => {
      setSwapId(id)
      swapMutation.mutate({ id })
  }
  
  const { limit, onPaginationChange, page, pagination } = usePagination();
  const { sorting, onSortingChange, field, order } = useSorting();

  const { data: history, isLoading } = useFetch<IResponseData<IHistory[]>>({
      api: apiGetHistory,
      key: ["history", activeTab, String(pagination.pageIndex), startDate, endDate],
      param: {
          page: pagination.pageIndex + 1,
          type: activeTab,
          start_date: startDate,
          end_date: endDate,
      },
      requireAuth: true
  })


  const swapMutation = useMutate<{ id?: string }, any>(
      apiSwap,
      {
        onSuccess: (data: IResponseData<"">) => {
          setSwapId("")
          Toast.show({
            type: 'success',
            text1: 'Swap was successful'
          })
        },
        showErrorMessage: true,
        requireAuth: true,
        id: swapId,
      }
    )


  const [searchTxt, setSearchTxt] = useState("")
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const Toptabs: {
    label: string;
    value: typeof activeTab;
  }[] =[
    {
      label: 'All Games',
      value: ''
    },
    {
      label: 'Finished',
      value: 'finished',
    },
    {
      label: 'On-Going',
      value: 'pending',
    },
  ]

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
      <View style={[styles.container,{paddingTop: Platform.OS==="android"?60:0, paddingBottom: Platform.OS==="android"?0:40}]}>
        <Text style={styles.header}>Games History</Text>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tabRow}>
              {
                Toptabs.map((item,idx)=>(
                <TouchableOpacity key={idx} onPress={()=>setActiveTab(item.value)}>
                  <Text style={[styles.tabText, (activeTab === item.value) && styles.tabActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>

                ))
              }

              <TouchableOpacity onPress={()=>router.push("/(mainscreens)/GameResult")}>
                  <Text style={[styles.tabText]}>
                    Game Result
                  </Text>
                </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <Text style={styles.timestamp}>21/12/2023 10:20pm</Text>
        
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

          <ScrollView style={{ width: '100%' }}>
            {
               (!history?.data || !history?.data?.length || !history?.count)
               ? 
               <View style={{
                 justifyContent: 'center',
                 alignItems: 'center',
                 marginVertical: 20,
                 flex: 1,
                 display: 'flex'
               }} className='text-center'>
                  {
                    isLoading ? 
                      <ActivityIndicator size="large" color={Colors.light.primary} />
                      :
                      <Text>No result</Text>
                    }
               </View>
               :
            history?.data?.map(item => (
              <GameRow item={item} key={item.id} handleSwap={handleSwap} />
            ))}
          </ScrollView>
          {
            Number(history?.count || 0) > limit &&
              <Pagination
                totalItems={Number(history?.count || 0)}
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
    </SafeAreaView>
  );
}
export default Game;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingHorizontal:20,
    flex: 1,
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
    gap:6,
  },
  rowItem: {
    marginBottom: 5,
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