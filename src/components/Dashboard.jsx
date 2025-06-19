import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useToast,
  Spinner,
  Flex,
  Icon,
  Badge,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ChatBox from "./ChatBox";
import VideoChat from "./VideoChat";
import {
  FaUser,
  FaEnvelope,
  FaBrain,
  FaHeart,
  FaMoon,
  FaSmoking,
  FaWineGlass,
  FaUsers,
} from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoStarted, setVideoStarted] = useState(false);

  useEffect(() => {
    const fetchCurrentMatch = async () => {
      try {
        const res = await axios.get(`/match/current/${user._id}`);
        setMatch(res.data.match);
      } catch (err) {
        console.log("No current match");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentMatch();
  }, [user._id]);

  const handleFindMatch = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/match/daily");
      setMatch(res.data.match);
      toast({ title: "Match created!", status: "success" });
    } catch (err) {
      toast({
        title: "No match available",
        description: err.response?.data?.message,
        status: "info",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUnpin = async () => {
    const reason = prompt("Why do you want to unpin?");
    if (!reason) return;

    try {
      await axios.post("/match/unpin", { reason });
      toast({ title: "Unpinned successfully", status: "warning" });
      setMatch(null);
      setVideoStarted(false);
    } catch (err) {
      toast({ title: "Error unpinning", status: "error" });
    }
  };

  const partner =
    match && (match.user1._id === user._id ? match.user2 : match.user1);

  return (
    <Box maxW="1200px" mx="auto" mt={10} p={6}>
      <Heading
        size="2xl"
        textAlign="center"
        mb={10}
        bgGradient="linear(to-r, pink.400, purple.500)"
        bgClip="text"
        fontWeight="extrabold"
      >
        💞 Your Match Dashboard
      </Heading>

      {loading ? (
        <Spinner size="xl" />
      ) : !match ? (
        <Box textAlign="center">
          <Text mb={3}>You have no active match yet.</Text>
          <Button colorScheme="blue" onClick={handleFindMatch}>
            Find Today's Match
          </Button>
        </Box>
      ) : (
        <Flex gap={6} flexWrap="wrap">
          <Box
            flex="1"
            p={6}
            borderWidth={1}
            borderRadius="2xl"
            boxShadow="md"
            bg="white"
            transition="all 0.3s"
            _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
            minW="300px"
            maxW="500px"
          >
            <VStack spacing={4} align="start">
              <Flex align="center" gap={2}><Icon as={FaHeart} color="pink.400" /><Text><strong>Match ID:</strong> {match._id}</Text></Flex>
              <Flex align="center" gap={2}><Icon as={FaUser} color="pink.400" /><Text><strong>You:</strong> {user.name}</Text></Flex>
              <Flex align="center" gap={2}><Icon as={FaUsers} color="pink.400" /><Text><strong>Matched with:</strong> {partner?.name}</Text></Flex>
              <Flex align="center" gap={2}><Icon as={FaEnvelope} color="pink.400" /><Text><strong>Email:</strong> {partner?.email}</Text></Flex>
              <Flex align="center" gap={2}><Icon as={FaBrain} color="pink.400" /><Text><strong>Personality:</strong> {partner?.personalityType}</Text></Flex>

              <Box>
                <Text fontWeight="semibold">Values:</Text>
                <Flex wrap="wrap" gap={2} mt={1}>{partner?.values?.map(val => <Badge key={val} colorScheme="purple">{val}</Badge>)}</Flex>
              </Box>
              <Box>
                <Text fontWeight="semibold">Interests:</Text>
                <Flex wrap="wrap" gap={2} mt={1}>{partner?.interests?.map(val => <Badge key={val} colorScheme="pink">{val}</Badge>)}</Flex>
              </Box>

              <Flex align="center" gap={2}><Icon as={FaMoon} /><Text><strong>Sleep Habit:</strong> {partner?.habits?.sleep}</Text></Flex>
              <Flex align="center" gap={2}><Icon as={FaSmoking} /><Text><strong>Smoking:</strong> {partner?.habits?.smoking ? "Yes" : "No"}</Text></Flex>
              <Flex align="center" gap={2}><Icon as={FaWineGlass} /><Text><strong>Drinking:</strong> {partner?.habits?.drinking ? "Yes" : "No"}</Text></Flex>

              <CircularProgress value={match.messageCount} max={100} color="pink.400" size="100px">
                <CircularProgressLabel>{match.messageCount ?? 0}/100</CircularProgressLabel>
              </CircularProgress>

              {match.pinned && match.messageCount >= 100 && !videoStarted ? (
                <>
                  <Text color="green.500" fontWeight="bold">🎉 Video Chat Unlocked!</Text>
                  <Button colorScheme="green" onClick={() => setVideoStarted(true)}>
                    Start Video Chat
                  </Button>
                </>
              ) : match.messageCount < 100 ? (
                <Text color="gray.500">Keep chatting to unlock video</Text>
              ) : null}

              <Button colorScheme="red" onClick={handleUnpin} mt={2}>
                Unpin Match
              </Button>
            </VStack>
          </Box>

          <Box
            flex="2"
            p={6}
            borderWidth={1}
            borderRadius="2xl"
            boxShadow="md"
            bg="white"
            minW="300px"
            maxW="650px"
          >
            <ChatBox roomId={match._id} partnerName={partner?.name} />
            {videoStarted && (
              <Box mt={4}>
                <VideoChat roomName={match._id} user={user} />
              </Box>
            )}
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default Dashboard;