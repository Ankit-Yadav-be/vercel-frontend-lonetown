import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  Icon,
  Image,
  HStack,
  Link,
  Avatar,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaUsers,
  FaRobot,
  FaArrowRight,
  FaSignInAlt,
  FaQuoteLeft,
} from "react-icons/fa";
import Lottie from "lottie-react";
import chatAnimation from "../assets/chat.json";
import heroImage from "../assets/couple-illustration.svg.jpg";

const MotionBox = motion(Box);

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    "linear(to-b, #fff0f5, #ffe4fa)",
    "linear(to-b, #1a202c, #2d3748)"
  );

  const handleNavigate = () => {
    navigate(user ? "/dashboard" : "/login");
  };

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Navbar */}
      <Flex
        px={10}
        py={4}
        align="center"
        justify="space-between"
        position="sticky"
        top={0}
        bg="whiteAlpha.800"
        backdropFilter="blur(10px)"
        boxShadow="sm"
        zIndex={100}
      >
        <Heading
          size="lg"
          color="pink.500"
          fontWeight="extrabold"
          letterSpacing="wide"
        >
          💌 Lone Town
        </Heading>

        <HStack spacing={4}>
          {user ? (
            <Button
              variant="solid"
              colorScheme="pink"
              onClick={() => navigate("/dashboard")}
              rightIcon={<FaArrowRight />}
              _hover={{ transform: "scale(1.05)" }}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                leftIcon={<FaSignInAlt />}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                colorScheme="pink"
                onClick={() => navigate("/register")}
                _hover={{ transform: "scale(1.05)" }}
              >
                Register
              </Button>
            </>
          )}
        </HStack>
      </Flex>

      {/* Hero Section */}
      <Flex
        direction={{ base: "column", md: "row" }}
        px={{ base: 6, md: 20 }}
        py={{ base: 6, md: 24 }}
        justify="space-between"
       
      >
        {/* Left Text */}
        <VStack align="start" spacing={6} maxW="xl">
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Heading
              fontSize={{ base: "3xl", md: "5xl" }}
              bgGradient="linear(to-r, pink.400, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
              lineHeight="1"
            >
              Find Deeper <br /> Real Connections
            </Heading>
            <Text fontSize="lg" color="gray.700">
              Not just another dating app. Lone Town helps you connect with people who match your energy.
            </Text>
          </MotionBox>

          <HStack spacing={4}>
            <Button size="lg" colorScheme="pink" onClick={handleNavigate}>
              {user ? "Open Dashboard" : "Start Matching"}
            </Button>
            {!user && (
              <Button variant="outline" size="lg" onClick={() => navigate("/register")}>
                Register Now
              </Button>
            )}
          </HStack>
        </VStack>

        {/* Right: Animation above Image */}
        <MotionBox
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          maxW="500px"
          w="full"
          textAlign="center"
        >
          <Lottie animationData={chatAnimation} loop autoplay style={{ height: 0 }} />
          <Image
            src={heroImage}
            alt="Couple illustration"
            borderRadius="2xl"
            boxShadow="2xl"
           
            
          />
        </MotionBox>
      </Flex>

      {/* Features Section */}
      <Box px={10} py={16} bg="white">
        <Heading textAlign="center" mb={12} color="pink.500" fontWeight="bold">
          💡 Why Lone Town?
        </Heading>
        <Flex wrap="wrap" gap={8} justify="center" align="center">
          <FeatureCard icon={FaHeart} title="Emotion-Based Matching" />
          <FeatureCard icon={FaUsers} title="Safe, Real Conversations" />
          <FeatureCard icon={FaRobot} title="Smart AI Compatibility" />
        </Flex>
      </Box>

      {/* Testimonials */}
      <Box py={20} px={6} bgGradient="linear(to-r, pink.50, purple.50)">
        <Heading textAlign="center" mb={10} fontSize="3xl" color="pink.500">
          ❤️ What People Are Saying
        </Heading>
        <Flex wrap="wrap" justify="center" gap={8}>
          {testimonials.map((t, i) => (
            <MotionBox
              key={i}
              p={6}
              maxW="xs"
              bg="white"
              borderRadius="xl"
              shadow="md"
              whileHover={{ scale: 1.03 }}
            >
              <Icon as={FaQuoteLeft} color="pink.400" boxSize={6} mb={2} />
              <Text fontStyle="italic" color="gray.700" mb={4}>
                “{t.text}”
              </Text>
              <HStack>
                <Avatar size="sm" name={t.name} src={t.avatar} />
                <Text fontWeight="medium">{t.name}</Text>
              </HStack>
            </MotionBox>
          ))}
        </Flex>
      </Box>

      {/* Footer */}
      <Flex
        py={6}
        px={10}
        justify="space-between"
        align="center"
        bg="gray.50"
        fontSize="sm"
        color="gray.500"
        mt={8}
      >
        <Text>&copy; {new Date().getFullYear()} Lone Town. All rights reserved.</Text>
        <HStack spacing={4}>
          <Link href="#">Privacy</Link>
          <Link href="#">Terms</Link>
          <Link href="#">Contact</Link>
        </HStack>
      </Flex>
    </Box>
  );
};

const FeatureCard = ({ icon, title }) => (
  <MotionBox
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.3 }}
    bg="pink.50"
    p={6}
    borderRadius="xl"
    shadow="md"
    maxW="sm"
    textAlign="center"
  >
    <Icon as={icon} w={10} h={10} color="pink.400" mb={4} />
    <Text fontWeight="semibold" fontSize="lg">
      {title}
    </Text>
  </MotionBox>
);

const testimonials = [
  {
    name: "Sneha Sharma",
    text: "I found someone who really understands me. Best decision ever!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Aman Roy",
    text: "No pressure, no swiping. Just real, meaningful connection.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Neha Verma",
    text: "The AI pairing was spot on. We're still talking every day!",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
];

export default Home;
