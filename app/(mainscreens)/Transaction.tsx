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
    case 'Success':
      return styles.success;
    case 'Pending':
      return styles.pending;
    case 'Failed':
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
  const [dateModalOpen, setDateModalOpen] = useState(false)
  
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
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
  
  
    const handleDateChange = (event: any, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) setDate(selectedDate);
    };
  
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Transactions',
          }}
        />
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
      
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.datePickerBtn}
              >
                <Text style={styles.filterBtnText}>
                  {date.toISOString().split('T')[0]}
                </Text>
              </TouchableOpacity>
            </View>
    
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={handleDateChange}
            />
          )}
    
          {/* Transaction Table */}
          <ScrollView horizontal>
            <View>
              <View style={[styles.row, styles.header]}>
                <Text style={[styles.cell, styles.headerCell]}>Time</Text>
                <Text style={[styles.cell, styles.headerCell]}>Transaction Type</Text>
                <Text style={[styles.cell, styles.headerCell]}>Transaction ID</Text>
                <Text style={[styles.cell, styles.headerCell]}>Amount</Text>
                <Text style={[styles.cell, styles.headerCell]}>Status</Text>
                <Text style={[styles.cell, styles.headerCell]}>Details</Text>
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
                    <Text style={styles.cell}>{item.id}</Text>
                    <Text style={styles.cell}>{item.amount}</Text>
                    <Text style={[styles.cell, getStatusStyle(item.status)]}>
                      {item.status}
                    </Text>
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
      minWidth: 150,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    success: {
      color: '#2e7d32',
      backgroundColor: '#e8f5e9',
      padding: 6,
      borderRadius: 8,
      textAlign: 'center',
    },
    pending: {
      color: '#b28704',
      backgroundColor: '#fff8e1',
      padding: 6,
      borderRadius: 8,
      textAlign: 'center',
    },
    failed: {
      color: '#c62828',
      backgroundColor: '#ffebee',
      padding: 6,
      borderRadius: 8,
      textAlign: 'center',
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
  });
  