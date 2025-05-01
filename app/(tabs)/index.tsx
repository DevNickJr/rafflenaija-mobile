import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const index = () => {

  const categories = ["Powerbank", "Headphones", "Speakers", "Smartwatches", "Tablets", "Gaming Consoles", "Phone Cases", "Portable Mini Fan", "Bluetooth Earpiece", "Wireless Mouse", "Webcam Cover", "Digital Alarm Clock", "Magnetic Phone Mount", "Car Phone Holder"]

  const [codes, setCodes] = useState([
    "A1","A2","A3","A4","A5","A6","A7","A8","A9",
    "B1","B2","B3","B4","B5","B6","B7","B8","B9",
    "C1","C2","C3","C4","C5","C6","C7","C8","C9",
    "D1","D2","D3","D4","D5","D6","D7","D8","D9",
    "E1","E2","E3","E4","E5","E6","E7","E8","E9",
    "F1","F2","F3","F4","F5","F6","F7","F8","F9",
    "G1","G2","G3","G4","G5","G6","G7","G8","G9",
    "H1","H2","H3","H4","H5","H6","H7","H8","H9",
    "I1","I2","I3","I4","I5","I6","I7","I8","I9",
    "J1","J2","J3","J4","J5","J6","J7","J8","J9",
    "K1","K2","K3","K4","K5","K6","K7","K8","K9",
    "L1","L2","L3","L4","L5","L6","L7","L8","L9",
    "M1","M2","M3","M4","M5","M6","M7","M8","M9",
    "N1","N2","N3","N4","N5","N6","N7","N8","N9",
    "O1","O2","O3","O4","O5","O6","O7","O8","O9",
    "P1","P2","P3","P4","P5","P6","P7","P8","P9",
    "Q1","Q2","Q3","Q4","Q5","Q6","Q7","Q8","Q9",
    "R1","R2","R3","R4","R5","R6","R7","R8","R9",
    "S1","S2","S3","S4","S5","S6","S7","S8","S9",
    "T1","T2","T3","T4","T5","T6","T7","T8","T9",
    "U1","U2","U3","U4","U5","U6","U7","U8","U9",
    "V1","V2","V3","V4","V5","V6","V7","V8","V9",
    "W1","W2","W3","W4","W5","W6","W7","W8","W9",
    "X1","X2","X3","X4","X5","X6","X7","X8","X9",
    "Y1","Y2","Y3","Y4","Y5","Y6","Y7","Y8","Y9",
    "Z1","Z2","Z3","Z4","Z5","Z6","Z7","Z8","Z9",
  ])

  const [selectedCategory, setSelectedCategory]=useState(0)

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={styles.container}>
        <ScrollView>
          <View style={{height:40}}>
            <ScrollView
              horizontal
              contentContainerStyle={{
                alignItems: 'flex-start', // Important for height to be based on children
              }}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.categoryStyle}>
                {categories.map((item, idx) => (
                  <TouchableOpacity 
                  key={idx} style={[styles.catItem,{backgroundColor: selectedCategory===idx ?"#D23433":undefined}]}
                  onPress={()=>setSelectedCategory(idx)}
                  >
                    <Text style={{ color:selectedCategory===idx ? "#fff" :"000"}}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
          
          {/* Ads Card */}
          <View style={{height:200, backgroundColor:"gray"}}></View>

          <View style={{flexDirection:"row", justifyContent:"space-between",paddingVertical:8, marginTop:8, alignItems:"center"}}>
            <Text style={{fontSize:16, fontWeight:"600"}}>{categories[selectedCategory]}</Text>

            <TouchableOpacity style={styles.randomBtn}>
              <Text>Ranndom Select</Text>
            </TouchableOpacity>
          </View>

          {/* Raffles */}
          <View style={styles.raffleContainer}>
            {
              codes.map((item, idx)=>(
                <TouchableOpacity key={idx} style={styles.rafCard}>
                  <Text style={{fontSize:18, color:"#fff"}}>{item}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  container:{
    flex:1,
    // backgroundColor:"#c0c0c0",
    paddingTop:20,
    paddingHorizontal:20
  },
  categoryStyle:{
    flexDirection:"row",
    gap:4
  },
  catItem:{
    backgroundColor:"#D23433",
    padding:6,
    borderRadius:2,
    borderWidth:0,
    elevation:0
  },
  randomBtn:{
    borderWidth:1,
    padding:6,
    borderRadius:14
  },
  raffleContainer:{
    marginTop:20, 
    flexDirection:"row", 
    flexWrap:"wrap", 
    gap:4,
    justifyContent:"center"
  },
  rafCard:{
    width:67,
    height:67,
    backgroundColor:"#449444",
    alignItems:"center",
    justifyContent:"center"
  }
})