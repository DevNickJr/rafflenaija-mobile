// TransactionTable.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Pagination from '@cherry-soft/react-native-basic-pagination';
import { Stack } from 'expo-router';
import { usePagination } from '@/hooks/usePagination';
import { useSorting } from '@/hooks/useSorting';
import { IResponseData, ITransaction } from '@/interfaces';
import { apiGetTransactions } from '@/services/WalletService';
import useFetch from '@/hooks/useFetch';
import { formatDate } from '@/lib/date';
import { Colors } from '@/constants/Colors';
const transactions = [
  {
    time: '21/12/2023 10:20pm',
    type: 'Deposit',
    id: '1234RNtrd1081',
    amount: '+10,000,000.00',
    status: 'Success',
  },
  {
    time: '21/12/2023 10:20pm',
    type: 'Withdrawal',
    id: '1234RNtrd1081',
    amount: '-200.00',
    status: 'Pending',
  },
  {
    time: '21/12/2023 10:20pm',
    type: 'Bet Played',
    id: '1234RNtrd1081',
    amount: '-100.00',
    status: 'Failed',
  },
  {
    time: '21/12/2023 10:20pm',
    type: 'Bet Played',
    id: '1234RNtrd1081',
    amount: '-100.00',
    status: 'Success',
  },
  {
    time: '21/12/2023 10:20pm',
    type: 'Bet Played',
    id: '1234RNtrd1081',
    amount: '-200.00',
    status: 'Success',
  },
  {
    time: '21/12/2023 10:20pm',
    type: 'Bet Played',
    id: '1234RNtrd1081',
    amount: '+100.00',
    status: 'Success',
  },
  {
    time: '21/12/2023 10:20pm',
    type: 'Bet Played',
    id: '1234RNtrd1081',
    amount: '+1000.00',
    status: 'Success',
  },
  {
    time: '21/12/2023 10:20pm',
    type: 'Bet Played',
    id: '1234RNtrd1081',
    amount: '-200.00',
    status: 'Failed',
  },
  {
    time: '21/12/2023 10:20pm',
    type: 'Bet Played',
    id: '1234RNtrd1081',
    amount: '+1000.00',
    status: 'Failed',
  },
  {
    time: '21/12/2023 10:20pm',
    type: 'Bet Played',
    id: '1234RNtrd1081',
    amount: '-200.00',
    status: 'Pending',
  },
];

const itemsPerPage = 10;

const sampleData = Array.from({ length: 40 }).map((_, i) => ({
    time: `2024-05-0${(i % 9) + 1}`,
    type: i % 3 === 0 ? 'Deposit' : i % 3 === 1 ? 'Withdrawal' : 'Game',
    id: `TXN-${i + 1}`,
    amount: `$${(Math.random() * 100).toFixed(2)}`,
    status: i % 2 === 0 ? 'Completed' : 'Pending',
  }));
  

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'success':
      return styles.success;
    case 'pending':
      return styles.pending;
    case 'failed':
      return styles.failed;
    default:
      return {};
  }
};

type TabType = "" | "deposit" | "withdrawal" | "bet"
const tabs: TabType[] = ['', 'deposit', 'withdrawal', 'bet']

const Transaction = () => {
  const [activeTab, setActiveTab] = useState<TabType>("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [showDatePicker, setShowDatePicker] = useState<"from" | "to" | null>(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [tempFromDate, setTempFromDate] = useState<Date>(new Date());
  const [tempToDate, setTempToDate] = useState<Date>(new Date());
  // const [dateModalOpen, setDateModalOpen] = useState(false)
  
  const { limit, onPaginationChange, page, pagination } = usePagination();
  const { sorting, onSortingChange, field, order } = useSorting();

  const { data: transactions, isLoading } = useFetch<IResponseData<ITransaction[]>>({
      api: apiGetTransactions,
      key: ["transactions", String(pagination.pageIndex), activeTab, startDate, endDate],
      param: {
          page: pagination.pageIndex + 1,
          transaction_type: activeTab,
          start_date: startDate,
          end_date: endDate,
      },
      requireAuth: true
  })

    const [date, setDate] = useState(new Date());
    

    // const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  
  
  
    return (
      <>
        {/* <Stack.Screen
          options={{
            title: 'Transactions',
          }}
        /> */}
        {/* <SafeAreaView style={styles.container}> */}
          <View style={{flex:1, paddingHorizontal:10}}>
            {/* Filter Buttons + Date Picker */}
            <View style={styles.topBar}>
              {tabs.map(type => (
                <TouchableOpacity
                  key={type}
                  onPress={() => {
                    setActiveTab(type);
                    setCurrentPage(1);
                  }}
                  style={[
                    styles.filterBtn,
                    activeTab === type && styles.activeFilterBtn,
                  ]}
                >
                  <Text style={[
                    styles.filterBtnText,
                    activeTab === type && { color: 'green' }
                  ]}>
                    {type ? type : 'All'}
                  </Text>
                </TouchableOpacity>
              ))}
      
              {/* <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.datePickerBtn}
              >
                <Text style={styles.filterBtnText}>
                  {date.toISOString().split('T')[0]}
                </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() => {
                  setTempFromDate(fromDate || new Date());
                  setTempToDate(toDate || new Date());
                  setDateModalOpen(true);
                }}
                style={styles.datePickerBtn}
              >
                <Text style={styles.filterBtnText}>Date</Text>
              </TouchableOpacity>
            </View>
          
          {/* Date Modal */}
          {dateModalOpen && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Date Range</Text>

                <TouchableOpacity
                  onPress={() => setShowDatePicker('from')}
                  style={styles.modalDateButton}
                >
                  <Text>From: {tempFromDate.toDateString()}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowDatePicker('to')}
                  style={styles.modalDateButton}
                >
                  <Text>To: {tempToDate.toDateString()}</Text>
                </TouchableOpacity>

                {showDatePicker === 'from' && (
                  <DateTimePicker
                    value={tempFromDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(e, date) => {
                      if (date) setTempFromDate(date);
                      setShowDatePicker(null);
                    }}
                  />
                )}

                {showDatePicker === 'to' && (
                  <DateTimePicker
                    value={tempToDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={(e, date) => {
                      if (date) setTempToDate(date);
                      setShowDatePicker(null);
                    }}
                  />
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalApplyBtn}
                    onPress={() => {
                      setFromDate(tempFromDate);
                      setToDate(tempToDate);
                      setStartDate(tempFromDate.toISOString().split('T')[0]);
                      setEndDate(tempToDate.toISOString().split('T')[0]);
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

          {/* {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
            />
          )} */}
    
          {/* Transaction Table */}
          <ScrollView horizontal>
            <View>
              <View style={[styles.row, styles.header]}>
                <Text style={[styles.cell, styles.headerCell]}>Time</Text>
                <Text style={[styles.cell, styles.headerCell]}>Transaction Type</Text>
                <Text style={[styles.cell, styles.headerCell, { width: 300 }]}>Transaction ID</Text>
                <Text style={[styles.cell, styles.headerCell]}>Amount</Text>
                <Text style={[styles.cell, styles.headerCell, { width: 70 }]}>Status</Text>
                {/* <Text style={[styles.cell, styles.headerCell]}>Details</Text> */}
              </View>
              <ScrollView>
                {
                  (!transactions?.data || !transactions?.data?.length)
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
                transactions?.data?.map((item, index) => (
                  <View key={index} style={styles.row}>
                    <Text style={styles.cell}>{formatDate(item.created_at)}</Text>
                    <Text style={styles.cell}>{item.transaction_type}</Text>
                    <Text style={{ ...styles.cell, width: 300 }}>{item.id}</Text>
                    <Text style={styles.cell}>{item.amount}</Text>
                    <Text style={[styles.cell, getStatusStyle(item.status), { width: 70 }]}>
                      {item.status}
                    </Text>
                    {/* <Text style={[styles.cell]}>
                    </Text> */}
                    {/* <TouchableOpacity style={styles.cell}>
                      <Text style={{ color: 'green' }}>Details</Text>
                    </TouchableOpacity> */}
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
    
          {/* Pagination */}
          {
              Number(transactions?.count || 0) > limit &&
              <Pagination
                  totalItems={Number(transactions?.count || 0)}
                  pageSize={limit}
                  currentPage={page}
                  onPageChange={onPaginationChange}
                  activeBtnStyle={{backgroundColor:'red', borderWidth:0, borderRadius:4}}
                  activeTextStyle={{color:"#fff"}}
                  btnStyle={{backgroundColor:"trasparent"}}
                  textStyle={{color:"black"}}
              />
            }
          </View>
        {/* </SafeAreaView> */}
      </>
    );
  };
  

export default Transaction;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal:20,
      backgroundColor:"#fff"
    },

    topBar: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    filterBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        // backgroundColor: '#eee',
        // borderRadius: 8,
    },
    activeFilterBtn: {
        // backgroundColor: '#007bff',
        borderBottomWidth:1,
        borderColor:'green'
    },
    filterBtnText: {
        color: 'gray',
        textTransform: 'capitalize'
    },
    datePickerBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#ddd',
        borderRadius: 8,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        flexWrap: 'wrap',
    },

    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      paddingVertical: 12,
      alignItems: 'center',
    },
    header: {
      backgroundColor: '#2e7d32',
    },
    headerCell: {
      color: 'white',
      fontWeight: 'bold',
    },
    cell: {
      width: 120,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    success: {
      color: '#2e7d32',
      backgroundColor: '#e8f5e9',
      padding: 6,
      borderRadius: 8,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    pending: {
      color: '#b28704',
      backgroundColor: '#fff8e1',
      padding: 6,
      borderRadius: 8,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    failed: {
      color: '#c62828',
      backgroundColor: '#ffebee',
      padding: 6,
      borderRadius: 8,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    pageBtn: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 5,
        borderRadius: 5,
        backgroundColor: '#eee',
    },
    activePageBtn: {
        backgroundColor: '#007bff',
    },
    pageBtnText: {
        color: '#000',
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
  