import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateDatesFromYearBeginning } from "../utils/generateDatesFromYearBeginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const datesFromYearStart = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 5;

const amountOfDaysToFill = minimumSummaryDatesSize - datesFromYearStart.length;

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>;

export const Home = () => {
  const { navigate } = useNavigation();

  const [summary, setSummary] = useState<Summary>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await api.get("summary");

      setSummary(response.data);
    } catch (error) {
      Alert.alert("Ops", "Não foi possível carregar o sumário de hábitos");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, index) => (
          <Text
            key={index}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            return (
              <HabitDay
                key={date.toISOString()}
                date={date}
                amountOfHabits={dayInSummary?.amount}
                amountCompleted={dayInSummary?.completed}
                onPress={() => navigate("habit", { date: date.toISOString() })}
              />
            );
          })}

          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <View
                key={index}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
};
