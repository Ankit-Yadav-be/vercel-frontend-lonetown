import { useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Select,
  Checkbox,
  Text,
  Flex,
  Image,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import registerImage from "../assets/register-illustration.jpg.jpg"; 
import axios from "../api/axios";

const MotionBox = motion(Box);

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    personalityType: "",
    values: [],
    sleep: "",
    smoking: false,
    drinking: false,
  });

  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "values") {
      const options = Array.from(e.target.selectedOptions, (option) => option.value);
      setForm({ ...form, values: options });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        gender: form.gender,
        dob: form.dob,
        personalityType: form.personalityType,
        values: form.values,
        habits: {
          sleep: form.sleep,
          smoking: form.smoking,
          drinking: form.drinking,
        },
      });
      toast({ title: "Registered!", status: "success", duration: 3000 });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Something went wrong",
        status: "error",
      });
    }
  };

  return (
    <Flex minH="100vh" direction={{ base: "column", md: "row" }}>
     
      <Box flex={1} bg="purple.50" display={{ base: "none", md: "block" }}>
        <Image
          src={registerImage}
          alt="Register Illustration"
          objectFit="cover"
          height="100vh"
          width="100%"
        />
      </Box>


      <Flex
        flex={1}
        align="center"
        justify="center"
        bg="white"
        px={8}
        py={10}
      >
        <MotionBox
          as="form"
          onSubmit={handleSubmit}
          p={8}
          borderRadius="2xl"
          shadow="xl"
          w="full"
          maxW="md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading textAlign="center" mb={2} color="purple.500">
            Join Lone Town 💞
          </Heading>
          <Text textAlign="center" color="gray.500" mb={6}>
            Create an account to find your perfect match.
          </Text>

          <VStack spacing={4}>
            <Input name="name" placeholder="Name" onChange={handleChange} isRequired />
            <Input name="email" placeholder="Email" onChange={handleChange} isRequired />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              isRequired
            />
            <Select name="gender" placeholder="Select Gender" onChange={handleChange} isRequired>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
            <Input name="dob" type="date" placeholder="Date of Birth" onChange={handleChange} isRequired />
            <Input
              name="personalityType"
              placeholder="Personality Type (e.g., INFJ)"
              onChange={handleChange}
            />
            <Select name="values" multiple onChange={handleChange}>
              <option value="honesty">Honesty</option>
              <option value="growth">Growth</option>
              <option value="empathy">Empathy</option>
              <option value="freedom">Freedom</option>
            </Select>
            <Select name="sleep" placeholder="Sleep Habit" onChange={handleChange}>
              <option value="early bird">Early Bird</option>
              <option value="night owl">Night Owl</option>
            </Select>
            <Checkbox name="smoking" onChange={handleChange}>
              Do you smoke?
            </Checkbox>
            <Checkbox name="drinking" onChange={handleChange}>
              Do you drink?
            </Checkbox>

            <Button
              type="submit"
              colorScheme="purple"
              width="full"
              mt={4}
              _hover={{ transform: "scale(1.03)", boxShadow: "md" }}
            >
              Register
            </Button>
          </VStack>

          <Text fontSize="sm" color="gray.600" mt={6} textAlign="center">
            Already have an account?{" "}
            <Button
              variant="link"
              colorScheme="purple"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login Here
            </Button>
          </Text>
        </MotionBox>
      </Flex>
    </Flex>
  );
};

export default Register;
