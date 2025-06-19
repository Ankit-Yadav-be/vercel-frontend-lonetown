import { useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  Flex,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import loginImage from "../assets/login-illustration.jpg.jpg"; 
import axios from "../api/axios"; 

const MotionBox = motion(Box); 

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const toast = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ✅ prevent form reload
    try {
      const res = await axios.post("/auth/login", form);
      login(res.data.user, res.data.token);
      toast({ title: "Login successful!", status: "success" });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Login failed",
        description: err.response?.data?.message || "Invalid credentials",
        status: "error",
      });
    }
  };

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
      {/* Left Image Section */}
      <Box flex={1} bg="pink.50" display={{ base: "none", md: "block" }}>
        <Image
          src={loginImage}
          alt="Login Illustration"
          objectFit="cover"
          height="100vh"
          width="100%"
        />
      </Box>

      {/* Right Login Section */}
      <Flex
        flex={1}
        align="center"
        justify="center"
        bg="white"
        px={8}
        py={12}
      >
        <MotionBox
          p={8}
          borderRadius="2xl"
          shadow="xl"
          w="full"
          maxW="md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading textAlign="center" mb={2} color="pink.500">
            Welcome Back 💌
          </Heading>
          <Text textAlign="center" color="gray.500" mb={6}>
            Login to continue your journey in Lone Town
          </Text>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={form.email}
                variant="filled"
                bg="gray.50"
                _focus={{ bg: "white", borderColor: "pink.400" }}
                isRequired
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                variant="filled"
                bg="gray.50"
                _focus={{ bg: "white", borderColor: "pink.400" }}
                isRequired
              />
              <Button
                colorScheme="pink"
                width="full"
                type="submit"
                _hover={{ transform: "scale(1.03)", boxShadow: "md" }}
              >
                Login
              </Button>
            </VStack>
          </form>

          <Text fontSize="sm" color="gray.600" mt={6} textAlign="center">
            New here?{" "}
            <Button
              variant="link"
              colorScheme="pink"
              size="sm"
              onClick={() => navigate("/register")}
            >
              Register Now
            </Button>
          </Text>
        </MotionBox>
      </Flex>
    </Flex>
  );
};

export default Login;
