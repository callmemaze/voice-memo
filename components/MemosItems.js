import { View, Text, Pressable } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Play } from "lucide-react-native";
import { Pause } from "lucide-react-native";
import { Audio } from "expo-av";

const MemosItems = ({ posts }) => {
  const path = posts.memos;
  const filePath = `https://kumuwxmjsvleqydhvyjd.supabase.co/storage/v1/object/public/${path}`;
  const [sound, setSound] = useState();
  const [status, setStatus] = useState();
  
  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      { uri: filePath },
      undefined,
      onPlaybackStatusUpdate
    );
    setSound(sound);
  }
  const onPlaybackStatusUpdate = useCallback(
    async (newStatus) => {
      setStatus(newStatus);

      if (!newStatus.isLoaded || !sound) {
        return;
      }

      if (newStatus.didJustFinish) {
        await sound?.setPositionAsync(0);
      }
    },
    [sound]
  );
  useEffect(() => {
    loadSound();
  }, [posts.filePath]);

  async function playSound() {
    if (!sound) {
      return;
    }
    if (status?.isLoaded && status.isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }
  const isPlaying = status?.isLoaded ? status.isPlaying : false;
  const position = status?.isLoaded ? status.positionMillis : 0;
  const duration = status?.isLoaded ? status.durationMillis : 1;

  const progress = position / duration;

  const formatMillis = (millis) => {
    const minute = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    const second = Math.floor((millis % (1000 * 60)) / 1000);
    return `${minute}:${second < 10 ? "0" : ""}${second}`;
  };

  return (
    <View className="h-14 bg-gray-200 flex-row items-center p-5 rounded-md justify-between shadow-black shadow-md mt-3">
      <Pressable onPress={playSound}>
        {isPlaying ? (
          <Pause className="text-black" />
        ) : (
          <Play className="text-black" />
        )}
      </Pressable>
      <View className="flex h-[50px] justify-center w-full p-3">
        <View className="h-[3px] bg-slate-400 w-full"></View>
        <View
          className="w-[15px] aspect-square rounded-full bg-blue-600 absolute"
          style={{ left: `${progress * 100}%` }}
        ></View>
        <Text className="absolute right-5 bottom-0 text-black">
          {formatMillis(position || 0)} / {formatMillis(duration || 0)}
        </Text>
      </View>
    </View>
  );
};

export default MemosItems;
