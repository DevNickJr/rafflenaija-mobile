import React, { useReducer, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Dropdown from '../Dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalBtn from '../ModalBtn';
import Toast from 'react-native-toast-message';
import { IDuration, IDurationAction, IResponseData } from '@/interfaces';
import { apiRestrictAccount } from '@/services/AuthService';
import useMutate from '@/hooks/useMutation';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const initialState: IDuration = {
  duration: 0,
  date: ''
}

const RestrictAccount: React.FC<Props> = ({ visible, onCancel, onConfirm }) => {
  const [user, dispatch] = useReducer((state: IDuration, action: IDurationAction) => {
    if (action.type === 'reset') {
        return initialState
    }
    return { ...state, [action.type]: action.payload }
}, initialState)

const restrictAccountMutation = useMutate<IDuration, any>(
    apiRestrictAccount,
    {
      onSuccess: (data: IResponseData<"">) => {
        //   console.log("new data", data)
        dispatch({ type: "reset", payload: "" })
        Toast.show({
          type: 'success',
          text1: data?.message || "Account Restricted successfully"
        });
      },
      showErrorMessage: true,
      requireAuth: true
    }
  )

  const handleRestrictAccount = () => {
    if (!user.date) {
        return Toast.show({
          type: 'success',
          text1: "Select end Date"
        });
    }
    let GivenDate = new Date(user?.date);
    let CurrentDate = new Date();

    let days = GivenDate.getTime() - CurrentDate.getTime()

    if (GivenDate < CurrentDate){
        return Toast.show({
          type: 'success',
          text1: "Given date must be greater than today's date."
        });
    }
    dispatch({ type: "duration", payload: Math.ceil(days/1000/60/60/24) })
    restrictAccountMutation?.mutate({ ...user, duration: Math.ceil(days/1000/60/60/24) })
  }

  const [restrictionPeriod, setRestrictionPeriod] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={styles.container}>
      <Dropdown
        label="Set Up Restriction Period"
        options={['1 day', '2 days', '3 days', '4 days', '5 days', '6 days', '7 days']}
        value={restrictionPeriod}
        onSelect={(val) => {
          setRestrictionPeriod(val);
          setShowDatePicker(true);
        }}
      />

      {(showDatePicker || selectedDate) && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Select End Date</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
            <Text>{selectedDate ? selectedDate.toDateString() : 'Choose date'}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
            />
          )}
        </View>
      )}

      {selectedDate && (
        <TouchableOpacity style={styles.saveButton} onPress={handleRestrictAccount}>
          <Text style={styles.saveText}>{restrictAccountMutation ? "Restricting.." : "Continue"}</Text>
        </TouchableOpacity>
      )}

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Restrict Account?</Text>
            <Text style={styles.modalText}>
              Raffle Naija's Account Restriction feature enables users to temporarily close their
              accounts. Throughout this period, users are unable to place bets or engage in card
              games, although account access remains for fund withdrawal. Per Raffle Naija's risk
              management protocols, any balance not previously wagered cannot be withdrawn.
            </Text>
            <Text style={styles.modalNote}>
              Please be noted that accounts can’t be re-enabled until the time period is concluded.
            </Text>

            <View style={styles.modalActions}>
              <ModalBtn title="Cancel" onPress={onCancel} inverted />
              <ModalBtn title="OK" onPress={onConfirm} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RestrictAccount;

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: 'green',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 10,
    textAlign: 'center',
  },
  modalNote: {
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});
