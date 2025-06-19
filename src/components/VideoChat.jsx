import { useEffect, useRef, useState } from "react";
import { Box, Spinner, Text, Center } from "@chakra-ui/react";

const VideoChat = ({ roomName, user }) => {
  const jitsiRef = useRef(null);
  const apiRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const domain = "meet.jit.si";

    const loadJitsiScript = () => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) return resolve();

        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const startConference = async () => {
      try {
        await loadJitsiScript();

        const options = {
          roomName,
          parentNode: jitsiRef.current,
          userInfo: {
            displayName: user.name,
          },
          configOverwrite: {
            prejoinPageEnabled: false,
            disableDeepLinking: true,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            DEFAULT_BACKGROUND: "#fff0f5",
          },
        };

        apiRef.current = new window.JitsiMeetExternalAPI(domain, options);
        apiRef.current.addEventListener("videoConferenceJoined", () =>
          setLoading(false)
        );
      } catch (error) {
        console.error("Failed to load Jitsi", error);
        setLoading(false);
      }
    };

    startConference();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [roomName, user.name]);

  return (
    <Box
      mt={6}
      w="100%"
      minH="500px"
      border="2px solid #FBB6CE"
      borderRadius="xl"
      overflow="hidden"
      shadow="lg"
      position="relative"
    >
      {loading && (
        <Center
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="whiteAlpha.700"
          zIndex={5}
          flexDir="column"
        >
          <Spinner size="xl" color="pink.400" />
          <Text mt={3} color="pink.500" fontWeight="medium">
            Loading video chat...
          </Text>
        </Center>
      )}
      <Box w="100%" h="100%" ref={jitsiRef} />
    </Box>
  );
};

export default VideoChat;
