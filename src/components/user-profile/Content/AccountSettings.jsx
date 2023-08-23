import {
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

function AccountSettings(props) {
  const [given_name, setGivenName] = useState(props?.userData?.given_name);
  const [family_name, setFamilyName] = useState(props?.userData?.family_name);
  const [email, setEmail] = useState(props?.userData?.email);
  const [gender, setGender] = useState(props?.userData?.gender);

  const toast = useToast();

  useEffect(() => {
    if (props) {
      setGivenName(props?.userData?.given_name);
      setFamilyName(props?.userData?.family_name);
      setEmail(props?.userData?.email);
      setGender(props?.userData?.gender);
    }
  }, [props]);

  const updateUser = async () => {
    try {
      const response = await fetch(
        "https://us-central1-serverless-project-sdp36.cloudfunctions.net/update-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            given_name,
            family_name,
            gender,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      toast({
        title: "User Updated.",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error.",
        description: "There was an error updating the user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
      gap={6}
    >
      <FormControl id="firstName">
        <FormLabel>First Name</FormLabel>
        <Input
          focusBorderColor="brand.blue"
          type="text"
          placeholder={props.given_name}
          value={given_name}
          onChange={(e) => setGivenName(e.target.value)}
        />
      </FormControl>

      <FormControl id="lastName">
        <FormLabel>Last Name</FormLabel>
        <Input
          focusBorderColor="brand.blue"
          type="text"
          placeholder={family_name}
          value={family_name}
          onChange={(e) => setFamilyName(e.target.value)}
        />
      </FormControl>

      <FormControl id="emailAddress">
        <FormLabel>Email Address</FormLabel>
        <Input
          focusBorderColor="brand.blue"
          type="email"
          placeholder={email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="gender">
        <FormLabel>Gender</FormLabel>
        <Select
          focusBorderColor="brand.blue"
          placeholder={"Select Gender"}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
      </FormControl>

      <Button colorScheme="blue" mt={4} onClick={updateUser}>
        Update
      </Button>
    </Grid>
  );
}

export default AccountSettings;
