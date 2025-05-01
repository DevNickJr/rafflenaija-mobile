import { StyleSheet, Text, Button, View } from 'react-native'
import React from 'react'
import { useSession } from '@/providers/SessionProvider'

const home = () => {
    const{signOut}=useSession()
  return (
    <View style={styles.container}>
      <Text>home</Text>

      <Button title='Logout' onPress={()=>signOut()}/>
    </View>
  )
}

export default home

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:20,
        paddingTop:60
    }
})