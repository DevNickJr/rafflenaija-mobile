// ReferralScreen.tsx
import ReferralWithdrawModal from '@/components/ReferralModal';
import RefferalModalV2 from '@/components/RefferalModalV2';
import React, { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Pagination from '@cherry-soft/react-native-basic-pagination';
import { Stack } from 'expo-router';
import { apiGetReferrals, apiReferral } from '@/services/ReferralService';
import useFetch from '@/hooks/useFetch';
import { usePagination } from '@/hooks/usePagination';
import { useSorting } from '@/hooks/useSorting';
import { IReferral } from '@/interfaces';
import { formatDate } from '@/lib/date';
import { Colors } from '@/constants/Colors';

const tableData = Array(20).fill({
  user: 'David William',
  date: '21/12/2023',
  status: 'Success',
  amount: '₦ 100',
  action: 'Claim',
});

const DATA = Array.from({ length: 50 }).map((_, i) => ({
  // id: i.toString(),
  // gameId: i % 2 === 0 ? 'RN-123460' : 'RN-000123',
  // gamePlayed: 'PowerBank',
  // phoneNumber: '080******32',
  // stake: '100 NGN',
  // time:'1 min ago',
  // status: i % 2 === 0 ? 'Lost' : 'Won',
  user: `David William ${i}`,
  date: '21/12/2023',
  status: 'Success',
  amount: '₦ 100',
  action: 'Claim',
  
}));


export interface IResponseData<T> {
  total_referrals: boolean;
  referrals: T;
}

const ReferralScreen = () => {
  const [isVisible, setIsVisible]=useState(false)
    
  const { limit, onPaginationChange: setPage, page, pagination } = usePagination();
  const { sorting, onSortingChange, field, order } = useSorting();
  // const [page, setPage] = useState(1);
  // const pageCount = Math.ceil(DATA.length / limit);
  // const paginatedData = DATA.slice((page - 1) * limit, page * limit);

  const { data: referrals, isLoading } = useFetch<IResponseData<IReferral[]>>({
    api: apiGetReferrals,
    select: ((d: any) => d?.data?.data),
    key: ["referrals", page, limit],
    requireAuth: true
})

const { data: referral } = useFetch<{ referral_link: string; wallet: { balance: number } }>({
    api: apiReferral,
    select: ((d: any) => d?.data?.data),
    key: ["referral"],
    requireAuth: true
})

  const handleCopy = async(text: string) => {
      await Clipboard.setStringAsync(text);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Copied to clipboard!');
      }
    };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Referrals',
        }}
      />
      <View style={{flex:1}}>
        <ScrollView style={styles.container}>
          {/* Header */}
          {/* <Text style={styles.header}>Referral</Text> */}
          <Text style={styles.tooltip}>
            You get NGN500 when a user registers with your link and the registered user deposits above NGN1000.
          </Text>

          {/* Referral Code */}
          <View style={styles.referralCodeContainer}>
            <TextInput
              style={styles.input}
              value={referral?.referral_link}
              editable={false}
            />
            <TouchableOpacity style={styles.copyButton} onPress={()=>handleCopy(referral?.referral_link || '')} >
              <Text style={styles.copyText}>Copy Code</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Section */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Total Referral</Text>
              <Text style={styles.summaryValue}>{referrals?.total_referrals || 0}</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Amount Earned</Text>
              <Text style={styles.summaryValue}>{`₦${referral?.wallet?.balance || "0.0"}`}</Text>
            </View>
          </View>

          {/* Withdraw Button */}
          <TouchableOpacity style={styles.withdrawButton} onPress={()=>setIsVisible(true)}>
            <Text style={styles.withdrawText}>Withdraw Amount Earned</Text>
          </TouchableOpacity>

          {/* Table */}
          <ScrollView horizontal>
            <View>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableHeaderText}>Referred User</Text>
                <Text style={styles.tableHeaderText}>Date Referred</Text>
                <Text style={styles.tableHeaderText}>Amount</Text>
                <Text style={styles.tableHeaderText}>Status</Text>
                {/* <Text style={styles.tableHeaderText}>Referred Amount</Text> */}
                {/* <Text style={styles.tableHeaderText}>Action</Text> */}
              </View>

              {/* Table Body */}
              {
                (!referrals?.referrals || !referrals?.referrals?.length || !referrals?.total_referrals)
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
              referrals?.referrals?.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.referred_user_phone_number}</Text>
                  <Text style={styles.tableCell}>{formatDate(item.created_at)}</Text>
                  <Text style={styles.tableCell}>{item.amount}</Text>
                  <Text style={[styles.tableCell, item.status === 'Success' ? styles.success : styles.pending]}>
                    {item.status}
                  </Text>
                  {/* <TouchableOpacity>
                    <Text style={[styles.tableCell, styles.claimButton]}>{item.action}</Text>
                  </TouchableOpacity> */}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Pagination */}
          <View style={styles.pagination}>
            {/* {[1, 2, 3, 4, 5, 6].map((page, idx) => (
              <TouchableOpacity key={idx} style={[styles.pageButton, page === 1 && styles.activePage]}>
                <Text style={page === 1 ? styles.activePageText : styles.pageText}>{page}</Text>
              </TouchableOpacity>
            ))} */}
            {
              Number(referrals?.total_referrals || 0) > limit &&
              <Pagination
                totalItems={Number(referrals?.total_referrals || 0)}
                pageSize={limit}
                currentPage={page}
                onPageChange={setPage}
                activeBtnStyle={{backgroundColor:'#449444', borderWidth:0, borderRadius:4}}
                activeTextStyle={{color:"#fff"}}
                btnStyle={{backgroundColor:"trasparent"}}
                textStyle={{color:"black"}}
              />
            }
          </View>
        </ScrollView>

        <RefferalModalV2 visible={isVisible} onClose={()=>setIsVisible(false)}/>
      </View>
    </>
  );
};

export default ReferralScreen;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tooltip: {
    fontSize: 12,
    color: '#555',
    marginBottom: 12,
  },
  referralCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  copyButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 4,
  },
  copyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryBox: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  withdrawButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  withdrawText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
    minWidth: screenWidth + 200,
  },
  tableHeader: {
    backgroundColor: '#e5f4e3',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 13,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
  },
  success: {
    color: 'green',
    fontWeight: 'bold',
  },
  pending: {
    color: '#c77d00',
    fontWeight: 'bold',
  },
  claimButton: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  pagination: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    // marginTop: 16,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#eee',
  },
  activePage: {
    backgroundColor: '#d9534f',
  },
  pageText: {
    color: '#333',
  },
  activePageText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});