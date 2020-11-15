import React from "react";
import {StyleSheet, Text, View, Image} from "react-native";

import {getHolidays} from "../holidays";
import namnsdagar from "../namnsdagar.json";

let toDay = new Date(),
  thisYear = toDay.getFullYear(),
  thisMonth = toDay.getMonth(),
  thisDate = toDay.getDate(),
  daysInThisMonth = daysInMonth(toDay.getMonth() + 1, toDay.getFullYear());

const shortWeekDayNames = ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"],
  weekDayNames = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
  shortMonthNames = ["Jan", "Feb", "Mars", "Apr", "Maj", "Juni", "Juli", "Aug", "Sep", "Okt", "Nov", "Dec"];

const CalendarRow = () => {
  const test = [];

  for (let i = 0; i < daysInThisMonth; i++) {
    let names = "";

    if (Array.isArray(namnsdagar[thisMonth][i])) {
      for (let j = 0; j < namnsdagar[thisMonth][i].length; j++) {
        names += namnsdagar[thisMonth][i][j] + " ";
      }
    }

    let textStyle = styles.smallText;
    let rowStyle = styles.dateContainer;

    if (new Date(toDay.getFullYear(), toDay.getMonth(), i).getDay() === 6) {
      textStyle = styles.redText;
      rowStyle = [styles.dateContainer, styles.fatBottom];
    }

    if (isToDayRed(new Date(toDay.getFullYear(), toDay.getMonth(), i + 1))) {
      textStyle = styles.redText;
    }

    test.push(
      <View key={i} style={rowStyle}>
        <View style={{width: 44}}>
          <Text style={[textStyle, styles.dateText]}>{i + 1}</Text>
        </View>
        <View style={{paddingTop: 2, flex: 1, flexDirection: "column"}}>
          <Text style={[textStyle, {marginBottom: -1, marginTop: 4}]}>{weekDayNames[new Date(toDay.getFullYear(), toDay.getMonth(), i + 1).getDay()]}</Text>
          <Text style={[textStyle, {fontSize: 12, fontStyle: "italic", marginTop: -1}]}>{names}</Text>
        </View>
        <View style={{paddingTop: 2, flexDirection: "column"}}>{isFlagDay(new Date(toDay.getFullYear(), toDay.getMonth(), i + 1))}</View>
      </View>
    );
  }
  return <View>{test}</View>;
};

export default CalendarRow;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: -2,
    marginBottom: -1,
    paddingRight: 3,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  dateText: {
    fontSize: 32,
  },
  smallText: {
    paddingLeft: 5,
    textAlign: "left",
    color: "black",
    fontSize: 14,
  },
  redText: {
    paddingLeft: 5,
    textAlign: "left",
    color: "red",
    fontSize: 14,
  },
  fatBottom: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
});

function isToDayRed(date) {
  let holidays = getHolidays(toDay);
  for (let i = 0; i < holidays.length; i++) {
    if (holidays[i].date.getFullYear() === date.getFullYear() && holidays[i].date.getMonth() === date.getMonth() && holidays[i].date.getDate() === date.getDate()) {
      if (holidays[i].isRed) {
        return true;
      }
    }
  }
  return false;
}

// Use 1 for January, 2 for February, etc.
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function isFlagDay(date) {
  let scale = 1.25;
  let holidays = getHolidays(toDay);
  for (let i = 0; i < holidays.length; i++) {
    if (holidays[i].date.getFullYear() === date.getFullYear() && holidays[i].date.getMonth() === date.getMonth() && holidays[i].date.getDate() === date.getDate()) {
      if (holidays[i].isRed && holidays[i].isFlagDay) {
        return (
          <View>
            <Image style={{width: 16 * scale, height: 10 * scale, position: "absolute", right: 0, top: 4}} source={require("../img/Flag_of_Sweden32x20.gif")} />
            <Text style={{position: "absolute", top: 22, right: 0, fontSize: 12}}>{holidays[i].name}</Text>
          </View>
        );
      }
      if (!holidays[i].isRed && holidays[i].isFlagDay) {
        return (
          <View>
            <Image style={{width: 16 * scale, height: 10 * scale, position: "absolute", right: 0, top: 4}} source={require("../img/Flag_of_Sweden32x20.gif")} />
            <Text style={{position: "absolute", top: 22, right: 0, fontSize: 12}}>{holidays[i].name}</Text>
          </View>
        );
      }
      if (!holidays[i].isRed && !holidays[i].isFlagDay) {
        return (
          <View>
            <Text style={{position: "absolute", top: 22, right: 0, fontSize: 12}}>{holidays[i].name}</Text>
          </View>
        );
      }
      if (holidays[i].isRed && !holidays[i].isFlagDay) {
        return (
          <View>
            <Text style={{position: "absolute", top: 22, right: 0, fontSize: 12}}>{holidays[i].name}</Text>
          </View>
        );
      }
    }
  }
  return null;
}
