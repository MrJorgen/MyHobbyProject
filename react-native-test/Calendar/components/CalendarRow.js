import React from "react";
import {StyleSheet, Text, View, Image} from "react-native";

import {getHolidays} from "../holidays";
import namnsdagar from "../namnsdagar.json";

const shortWeekDayNames = ["Sön", "Mån", "Tis", "Ons", "Tors", "Fre", "Lör"],
  weekDayNames = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
  shortMonthNames = ["Jan", "Feb", "Mars", "Apr", "Maj", "Juni", "Juli", "Aug", "Sep", "Okt", "Nov", "Dec"];

  let toDay;

const CalendarRow = (props) => {
  toDay = new Date(props.date);
  let  thisYear = toDay.getFullYear(),
    thisMonth = toDay.getMonth(),
    thisDate = toDay.getDate(),
    daysInThisMonth = daysInMonth(toDay.getMonth() + 1, toDay.getFullYear());

  const test = [];

  for (let i = 0; i < daysInThisMonth; i++) {
    let names = "";

    if (Array.isArray(namnsdagar[thisMonth][i])) {
      names += namnsdagar[thisMonth][i].join(", ");
    }

    let textStyle = styles.smallText;
    let rowStyle = [styles.dateContainer];

    if (new Date(toDay.getFullYear(), toDay.getMonth(), i).getDay() === 6) {
      textStyle = styles.redText;
      rowStyle.push(styles.fatBottom);
    }

    if (isToDayRed(new Date(toDay.getFullYear(), toDay.getMonth(), i + 1))) {
      textStyle = styles.redText;
    }

    test.push(
      <View key={i} style={rowStyle}>
        <View style={{width: 44}}>
          <Text style={[textStyle, styles.dateText, {textAlign: "right", paddingRight: 3}]}>{i + 1}</Text>
        </View>
        <View style={{paddingTop: 2, flex: 1, flexDirection: "column"}}>
          <Text style={[textStyle, {marginBottom: -1, marginTop: 4}]}>
            {weekDayNames[new Date(toDay.getFullYear(), toDay.getMonth(), i + 1).getDay()]}
          </Text>
          <Text style={[textStyle, {fontSize: 12, fontStyle: "italic", marginTop: -1}]}>
            {names}
          </Text>
        </View>
        <View style={{height: 20, flexDirection: "column", flex: 1}}>
          <Text style={{textAlign: "right", marginTop: 2 }}>
          {isMonday(new Date(toDay.getFullYear(), toDay.getMonth(), i + 1))}
          </Text>
          {isFlagDay(new Date(toDay.getFullYear(), toDay.getMonth(), i + 1))}
        </View>
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
    borderBottomColor: "#000",
    borderBottomWidth: 0.5,
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

function isMonday(date) {
  if(date.getDay() === 1 || date.getDate() === 1){
    return(
      "v " + getWeekNumber(date)
    )
  }
}

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
          <View style={{justifyContent: "flex-end"}}>
            <Image style={{width: 16 * scale, height: 10 * scale, position: "absolute", right: 0, top: 4}} source={require("../img/Flag_of_Sweden32x20.gif")} />
            <Text style={{position: "absolute", top: 22, right: 0, fontSize: 12}}>{holidays[i].name}</Text>
          </View>
        );
      }
      if (!holidays[i].isRed && holidays[i].isFlagDay) {
        return (
          <View style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <Text style={{fontSize: 12, paddingRight: 5}}>{holidays[i].name}</Text>
            <Image style={{width: 16 * scale, height: 10 * scale, marginTop: 2}} source={require("../img/Flag_of_Sweden32x20.gif")} />
          </View>
        );
      }
      if (!holidays[i].isRed && !holidays[i].isFlagDay) {
        return (
          <View>
            <Text style={{fontSize: 12, textAlign: "right"}}>{holidays[i].name}</Text>
          </View>
        );
      }
      if (holidays[i].isRed && !holidays[i].isFlagDay) {
        return (
          <View>
            <Text style={{fontSize: 12, textAlign: "right"}}>{holidays[i].name}</Text>
          </View>
        );
      }
    }
  }
  return null;
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
