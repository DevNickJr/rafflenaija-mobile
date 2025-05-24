import { IImage } from '@/interfaces'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Image, Platform } from 'react-native'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Modal, View } from 'react-native'

interface IProps {
    showImageModal: boolean
    setShowImageModal: React.Dispatch<React.SetStateAction<boolean>>
    images: IImage[]
    setImages: React. Dispatch<React.SetStateAction<IImage[]>>
}

const ImageGalleryModal = ({ showImageModal, setShowImageModal, images, setImages }: IProps) => {
  const [modalImgIdx, setModalImgIdx]=useState(0)

  return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={showImageModal}
        onRequestClose={() => {
        // Alert.alert('Modal has been closed.');
        setImages([])
        setShowImageModal(false);
        }}>
        <View style={styles.modalContainer}>
            {/* Top Nav */}
            <View style={styles.modalTopNNav}>
                <TouchableOpacity 
                // style={styles.modalImgBtn}
                onPress={()=> {
                    setImages([])
                    setShowImageModal(false)
                }}
                >
                <Ionicons name="close" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.modalInnerWrapper}>
                <Image 
                    source={{ uri: images[modalImgIdx]?.image_url }}
                    style={{width:300, height:350,}}
                    resizeMode="stretch"
                />
                <View style={{flexDirection:"row", gap:6, justifyContent:"center"}}>
                {
                    images?.map((item, idx)=>(
                        <TouchableOpacity 
                            key={idx} onPress={()=> setModalImgIdx(idx)}
                            style={[
                                styles.modalImgBtn, 
                                idx == modalImgIdx &&  {
                                    borderWidth: 2,
                                    borderColor: '#ccc'
                                }
                            ]}
                        >
                            <Image 
                            source={{ uri: item.image_url }}
                            style={{width:60, height:60,}}
                            resizeMode="stretch"
                            />
                        </TouchableOpacity>
                    ))
                
                }
                </View>
            </View>
        </View>
    </Modal>
  )
}

export default ImageGalleryModal

const styles = StyleSheet.create({
    modalContainer:{
      flex:1,
      backgroundColor:"rgba(0,0,0,0.6)"
    },
    modalInnerWrapper:{
      flex:1, 
      alignItems:"center",
      justifyContent:"center",
      gap:20
    },
    modalImgBtn:{
      borderColor:"#c0c0c0",
      padding:2,
      borderRadius: 10,
      borderWidth: 1,
    },
    modalTopNNav:{
      marginTop: Platform.OS === "android"?10:60,
      paddingHorizontal:20,
      flexDirection:"row",
      justifyContent:"flex-end"
    }
  });
  