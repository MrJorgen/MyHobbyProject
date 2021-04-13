import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import CalendarRow from "./components/CalendarRow";

import { schema } from "./schema";

let toDay = new Date(),
  thisMonth = toDay.getMonth(),
  offSet = 50;

const monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>

      <View style={styles.borderBottom}>
        <Text style={styles.monthText}>
          {monthNames[thisMonth]} {toDay.getFullYear()}
        </Text>
        <Icon onPress={() => {Alert.alert("Todays date", toDay.toDateString())}} name="bars" color="#555" size={32} style={styles.navIcon} />
      </View>

      <ScrollView>
        <CalendarRow date={toDay} />
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  borderBottom: {
    borderBottomColor: "#999",
    borderBottomWidth: 0.5
  },
  navIcon: {
    position: "absolute",
    top: 5,
    left:5,
    paddingHorizontal: 5
  },
  monthText: {
    textAlign: "center",
    color: "darkslateblue",
    fontSize: 32
  }
});

export default App;
