
import React, { useState } from 'react';
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
} from 'react-native';
import Pagination from '@cherry-soft/react-native-basic-pagination';
import DateTimePicker from '@react-native-community/datetimepicker';

const DATA = Array.from({ length: 20 }).map((_, i) => ({
  id: i.toString(),
  gameId: i % 2 === 0 ? 'RN-123460' : 'RN-000123',
  gamePlayed: 'PowerBank',
  phoneNumber: '080******32',
  stake: '100 NGN',
  time:'1 min ago',
  status: i % 2 === 0 ? 'Lost' : 'Won',
  
}));

const GameRow = ({ item }: { item: typeof DATA[0] }) => (
  <View style={[styles.row, styles.won ]}>
    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Game ID</Text>
      <Text style={styles.value}>{item.gameId}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Game Played</Text>
      <Text style={styles.value}>{item.gamePlayed}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Game Played</Text>
      <Text style={styles.value}>{item.phoneNumber}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Total Stake</Text>
      <Text style={styles.value}>{item.stake}</Text>
    </View>

    <View style={[styles.rowItem,styles.cell]}>
      <Text style={styles.label}>Status</Text>
      <Text style={[styles.value, item.status === 'Lost' ? styles.statusLost : styles.statusWon]}>{item.status}</Text>
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
  const [page, setPage] = useState(1);
  const [searchTxt, setSearchTxt] = useState("")
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const itemsPerPage = 6;
  const pageCount = Math.ceil(DATA.length / itemsPerPage);
  const paginatedData = DATA.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // const Toptabs =["All Games","Finished","On-Going"]

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
      <View style={[styles.container,{paddingTop: Platform.OS==="android"?10:0, paddingBottom: Platform.OS==="android"?0:40}]}>
        <Text style={styles.header}>Games Result</Text>

        

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

        <ScrollView horizontal>
          <ScrollView style={{ width: '100%' }}>
            {paginatedData.map(item => (
              <GameRow item={item} key={item.id} />
            ))}
          </ScrollView>
        </ScrollView>

        <Pagination
          totalItems={pageCount * 5}
          pageSize={pageCount}
          currentPage={page}
          onPageChange={setPage}
          activeBtnStyle={{backgroundColor:'#449444', borderWidth:0, borderRadius:4}}
          activeTextStyle={{color:"#fff"}}
          btnStyle={{backgroundColor:"trasparent"}}
          textStyle={{color:"black"}}
        />
      </View>
    </SafeAreaView>
  );
}
export default GameResults;
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
    gap:6
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