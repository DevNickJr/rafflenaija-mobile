
import React, { useEffect, useRef, useState } from 'react';
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
  Dimensions,
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
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('screen');

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

const today = new Date()

const GameResults=()=> {
  const [activeTab, setActiveTab] = useState<"finished" | "pending" | "">("")
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tempEndDate, setTempEndDate] = useState<Date>()
  const [tempStartDate, setTempStartDate] = useState<Date>()
  const [showDatePicker, setShowDatePicker] = useState<"from" | "to" | null>(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [swapId, setSwapId] = useState("")
  const [search, setSearch] = useState("")
  const [date, setDate] = useState(new Date());

  const dateRef = useRef<null | HTMLInputElement>(null)
    
  const { limit, onPaginationChange, page, pagination } = usePagination();
  const { sorting, onSortingChange, field, order } = useSorting();

  const { data: results, isLoading } = useFetch<IResponseData<IGameResult[]>>({
      api: apiGetResults,
      key: ["game-results", pagination.pageIndex, startDate, endDate, search],
      param: {
          page: pagination.pageIndex + 1,
          type: activeTab,
          start_date: startDate,
          end_date: endDate,
          search,
          // type: activeTab
      },
      // requireAuth: true
  })

  useEffect(() => {
    if (page != 1) {
      onPaginationChange(1)
    }
  }, [startDate, endDate, activeTab])

  console.log({ results })
  
  return (
    <>
    <Stack.Screen
      options={{
        title: 'Game Results (Public)',
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
            value={search} onChangeText={(txt)=>setSearch(txt)} 
          />
          {
            search.length>0?
          <TouchableOpacity 
            style={styles.dateFilter} onPress={()=>setSearch("")}>
            <Text style={styles.dateFilterText}>Search</Text>
          </TouchableOpacity>:
          <TouchableOpacity 
            style={styles.dateFilter} onPress={() => setDateModalOpen(true)}>
            <Text style={styles.dateFilterText}>Pick Date</Text>
          </TouchableOpacity>
          }
        </View>

        <ScrollView horizontal style={{ flex: 1, width: '100%' }}>
          <View style={{ flex: 1 }}>
            {
                 (!results?.data || !results?.data?.length)
                 ? 
                 <View style={{
                   justifyContent: 'center',
                   alignItems: 'center',
                   marginVertical: 20,
                   width: width,
                 }} className='text-center'>
                   {
                   isLoading ? 
                     <ActivityIndicator size="large" color={Colors.light.primary} />
                     :
                     <Text style={{ textAlign: "center"}}>No result</Text>
                   }
               
                 </View>
                 :
              <ScrollView style={{ width: '100%', flex: 1 }}>
                {
                  results?.data?.map(item => (
                  <GameRow item={item} key={item.game_id} />
                ))}
              </ScrollView>
            }
          </View>
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
              {dateModalOpen && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Date Range</Text>

                <TouchableOpacity
                  onPress={() => setShowDatePicker('from')}
                  style={styles.modalDateButton}
                >
                  <Text>From: {tempStartDate?.toDateString()}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowDatePicker('to')}
                  style={styles.modalDateButton}
                >
                  <Text>To: {tempEndDate?.toDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker === 'from' && (
                  <DateTimePicker
                    value={tempStartDate || today}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(e, date) => {
                      if (date) {
                        if (date > today) {
                          Toast.show({
                            type: 'error',
                            text1: 'Start Date cannot be in the future',
                          });
                        } else {
                          setTempStartDate(date)
                        }
                      };
                      setShowDatePicker(null);
                    }}
                  />
                )}

                {showDatePicker === 'to' && (
                  <DateTimePicker
                    value={tempEndDate || today}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(e, date) => {
                      if (date) {
                        if (tempStartDate && date < tempStartDate) {
                          Toast.show({
                            type: 'error',
                            text1: 'End Date cannot be before Start Date',
                          });
                        } else {
                          setTempEndDate(date)
                        }
                      };
                      setShowDatePicker(null);
                    }}
                  />
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalApplyBtn}
                    onPress={() => {
                      setStartDate(tempStartDate?.toISOString().split('T')[0] || '');
                      setEndDate(tempEndDate?.toISOString().split('T')[0] || '');
                      setDateModalOpen(false);
                    }}
                  >
                    <Text style={{ color: 'white' }}>Apply</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setDateModalOpen(false)}
                  >
                    <Text style={{ color: 'black' }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
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
  // Date Form Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
    elevation: 5,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  
  modalDateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  
  modalApplyBtn: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  
  modalCancelBtn: {
    backgroundColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
});