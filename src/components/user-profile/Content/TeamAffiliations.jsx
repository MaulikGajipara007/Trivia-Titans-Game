import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import axios from "axios";

function TeamAffiliations({ teamId, isTeamOwner, email }) {
  const [team, setTeam] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchTeamData = async () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://bluw11ljg3.execute-api.us-east-1.amazonaws.com/dev/team?team_id=${teamId}`,
        headers: {},
      };

      try {
        const response = await axios.request(config);
        console.log("API Response:", response.data);
        if (response.data.status) {
          setTeam(response.data.data);
        } else {
          toast({
            title: "Error fetching team data.",
            description: response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error fetching team data.",
          description: "An error occurred while fetching the team data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchTeamData();
  }, []);

  const handleLeaveTeam = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://bluw11ljg3.execute-api.us-east-1.amazonaws.com/dev/team/leave?email=${email}&team_id=${teamId}`,
      headers: {},
    };

    try {
      if (!isTeamOwner) {
        // const response = await axios.request(config);
        // console.log("API Response:", response.data);

        toast({
          title: "Team update.",
          description: "You've successfully left the team.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Team update.",
          description: "Owner cannot leave the team.",
          status: "warining",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Erro updateing team.",
        description: "An error occurred while updating the team data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!team) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box
      maxW="xl"
      mx="auto"
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
    >
      <Heading mb={4} color="teal.500" size="lg">
        {team.name}
      </Heading>
      <Text fontSize="md" color="gray.500" mb={3}>
        Team ID: {team.team_id}
      </Text>
      <Text fontWeight="bold" mb={2}>
        Members:
      </Text>
      <List spacing={1} mb={5}>
        {team.teamMember.map((member) => (
          <ListItem key={member.email}>
            {member.given_name} {member.family_name} ({member.email})
          </ListItem>
        ))}
      </List>
      {
        <Button colorScheme="teal" variant="outline" onClick={handleLeaveTeam}>
          Leave Team
        </Button>
      }
    </Box>
  );
}

export default TeamAffiliations;
