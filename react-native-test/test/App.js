import React from "react";
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native";

import CalendarRow from "./components/CalendarRow";

import {schema} from "./schema";

let toDay = new Date(),
  thisMonth = toDay.getMonth();

const monthNames = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];

const App = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.monthContainer}>
          <Text style={styles.monthText}>
            {monthNames[thisMonth]} {toDay.getFullYear()}{" "}
          </Text>
        </View>
        <CalendarRow />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    fontFamily: "Verdana",
    backgroundColor: "#eee",
    alignItems: "center",
  },
  monthContainer: {
    flex: 1,
    width: "100%",
    borderBottomColor: "#999",
    borderBottomWidth: 1,
  },
  monthText: {
    textAlign: "center",
    color: "darkslateblue",
    fontSize: 36,
    paddingTop: 5,
  },
});

function formatDate(date) {
  let month = date.getMonth() + 1,
    day = date.getDate(),
    year = date.getFullYear();

  if (month.toString().length < 2) {
    month = "0" + month;
  }
  if (day.toString().length < 2) {
    day = "0" + day;
  }

  return year + "-" + month + "-" + day;
}

function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return week number
  return weekNo;
}

export default App;
