import { View, Text, FlatList, Pressable, RefreshControl } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import { Recording } from "expo-av/build/Audio";
import { useGlobalContext } from "~/context/GlobalProvider";
import { supabase } from "../libs/supabase";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import getAudio from "~/libs/getAudio";
import MemosItems from "~/components/MemosItems";

const Home = () => {
  const { user } = useGlobalContext();
  const [recording, setRecording] = useState();
  const [memos, setMemos] = useState([]);
  const [audioMetering, setAudioMetering] = useState([]);
  const { data: posts, refetch } = getAudio(user.user.id);
  const [refreshing, setRefreshing] = useState(false);
  const metering = useSharedValue(-100);
  const animatedRedCircle = useAnimatedStyle(() => ({
    width: withSpring(recording ? "60%" : "100%"),
    borderRadius: withTiming(recording ? 5 : 35),
  }));

  async function startRecording() {
    try {
      setAudioMetering([]);

      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        undefined,
        100
      );
      setRecording(recording);

      recording.setOnRecordingStatusUpdate((status) => {
        if (status.metering) {
          metering.value = status.metering;
          setAudioMetering((curVal) => [...curVal, status.metering || -100]);
        }
      });
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    if (!recording) {
      return;
    }

    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    metering.value = -100;
    if (uri) {
      setMemos((existingMemos) => [
        { uri, metering: audioMetering },
        ...existingMemos,
      ]);
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });
      const filePath = `${user.user.id}/${new Date().getTime()}`;
      const { data } = await supabase.storage
        .from("memos")
        .upload(filePath, decode(base64), {
          contentType: "audio/mpeg",
        });
      await supabase
        .from("memos")
        .insert({ creator: user.user.id, memos: data.fullPath });
    }
  }
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  return (
    <SafeAreaView>
      <View className="h-screen flex flex-col ">
        <FlatList
          data={posts.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MemosItems posts={item} />}
          ListHeaderComponent={() => (
            <View className="p-3 m-3">
              <View className="flex flex-row justify-between items-center ">
                <Text className="text-2xl font-bgbold"> Your Recordings </Text>
                <View>
                  <Text> Edit </Text>
                </View>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        ></FlatList>
        <View className="h-1/4 justify-self-end flex items-center  bg-black">
          <Pressable
            className="w-[70px] h-[70px] rounded-full border-4 border-white  justify-center items-center mt-7"
            onPress={recording ? stopRecording : startRecording}
          >
            <Animated.View
              style={[animatedRedCircle]}
              className="bg-red-600 aspect-square"
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
