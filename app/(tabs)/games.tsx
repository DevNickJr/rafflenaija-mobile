
import React, { useEffect, useState } from 'react';
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
import { usePagination } from '@/hooks/usePagination';
import { useSorting } from '@/hooks/useSorting';
import useFetch from '@/hooks/useFetch';
import { IHistory, IResponseData } from '@/interfaces';
import { apiGetHistory, apiSwap } from '@/services/GameService';
import useMutate from '@/hooks/useMutation';
import Toast from 'react-native-toast-message';
import { Colors } from '@/constants/Colors';
const today = new Date()

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
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tempEndDate, setTempEndDate] = useState<Date>()
  const [tempStartDate, setTempStartDate] = useState<Date>()
  const [showDatePicker, setShowDatePicker] = useState<"from" | "to" | null>(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [search, setSearch] = useState("")
  const [swapId, setSwapId] = useState("")

  const handleSwap = (id: string) => {
      setSwapId(id)
      swapMutation.mutate({ id })
  }
  
  const { limit, onPaginationChange, page, pagination } = usePagination();
  const { sorting, onSortingChange, field, order } = useSorting();

  const { data: history, isLoading } = useFetch<IResponseData<IHistory[]>>({
      api: apiGetHistory,
      key: ["history", activeTab, pagination.pageIndex, startDate, endDate, search],
      param: {
          page: pagination.pageIndex + 1,
          type: activeTab,
          start_date: startDate,
          end_date: endDate,
          search,
      },
      requireAuth: true
  })

  useEffect(() => {
    if (page != 1) {
      onPaginationChange(1)
    }
  }, [startDate, endDate, activeTab])


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
            <TouchableOpacity 
              style={styles.dateFilter} onPress={() => setDateModalOpen(true)}>
              <Text style={styles.dateFilterText}>Pick Date</Text>
            </TouchableOpacity>
{/* 
              <TouchableOpacity onPress={()=>router.push("/(mainscreens)/GameResult")}>
                  <Text style={[styles.tabText]}>
                    Game Result
                  </Text>
                </TouchableOpacity> */}
            </View>
          </ScrollView>
        </View>

        {/* <Text style={styles.timestamp}>21/12/2023 10:20pm</Text> */}
        
        {/* Date and search input */}
        <View style={styles.searchFilterRow}>
          <TextInput 
            style={styles.input} placeholder="Search for Game ID"
            value={search} onChangeText={(txt)=>setSearch(txt)} 
          />
          {/* {
            search.length>0 ?
          <TouchableOpacity 
            style={styles.dateFilter} onPress={()=>setSearch("")}>
            <Text style={styles.dateFilterText}>Search</Text>
          </TouchableOpacity>: */}
          {/* <TouchableOpacity 
            style={styles.dateFilter} onPress={() => setDateModalOpen(true)}>
            <Text style={styles.dateFilterText}>Pick Date</Text>
          </TouchableOpacity> */}
          {/* } */}
        </View>
          <ScrollView style={{ width: '100%' }} horizontal>
            <ScrollView>
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
    alignItems: "center",
    
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
    width: 150,
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