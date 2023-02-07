import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generateProgressPercentage";

interface Params {
  date: string;
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  completedHabits: string[];
}

export const Habit = () => {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setdayInfo] = useState<HabitsInfo>();

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        dayInfo.completedHabits.length
      )
    : 0;

  const fetchHabits = async () => {
    try {
      setLoading(true);

      const response = await api.get("/day", {
        params: {
          date,
        },
      });

      setdayInfo(response.data);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Ops",
        "Não foi possível carregar as informações dos hábitor"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    const isHabitAlreadyCompleted = dayInfo?.completedHabits.includes(habitId);

    await api.patch(`/habits/${habitId}/toggle`);

    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = dayInfo!.completedHabits.filter((id) => id !== habitId);
    } else {
      completedHabits = [...dayInfo!.completedHabits, habitId];
    }

    setdayInfo((prev) => {
      if (!prev) return undefined;

      return { ...prev, completedHabits };
    });
  };
  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className="mt-6">
          {dayInfo?.possibleHabits.map((habit) => (
            <Checkbox
              key={habit.id}
              title={habit.title}
              checked={dayInfo.completedHabits.includes(habit.id)}
              onPress={() => handleToggleHabit(habit.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
