import { useState, useEffect } from "react";
import { Box, Text, VStack, Circle } from "@chakra-ui/react";

function ListItem({ id, name, value, color }) {
  return (
    <Box
      key={id}
      as="li"
      w="full"
      py={3}
      px={5}
      d="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottomWidth={1}
      borderColor="brand.light"
      position="relative"
    >
      <Text color="brand.dark">{name}</Text>
      <Text color={`brand.${color}`} fontWeight="bold">
        {value}
      </Text>
    </Box>
  );
}

function Data() {
  const [userScores, setUserScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    fetch(
      "https://us-central1-serverlessproject-391916.cloudfunctions.net/getUserScoreList",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: email,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setUserScores(data.userScores);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data:", error);
        setLoading(false);
      });
  }, []);

  function getBadgeType(points) {
    if (points <= 10) return { type: "Bronze", color: "brown" };
    if (points <= 20) return { type: "Silver", color: "silver" };
    if (points <= 30) return { type: "Gold", color: "gold" };
    return { type: "Platinum", color: "#E5E4E2" };
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const totalUserScore = userScores.reduce(
    (acc, curr) => acc + curr.teamScore.userScore,
    0
  );
  const totalTeamScore = userScores.reduce(
    (acc, curr) => acc + curr.teamScore.teamScore,
    0
  );
  const gamesPlayed = userScores.length;

  return (
    <VStack as="ul" spacing={0} listStyleType="none" textAlign={"center"}>
      <Circle
        w={20}
        h={20}
        bgColor={getBadgeType(totalUserScore).color}
        color="white"
        fontSize="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {getBadgeType(totalUserScore).type}
      </Circle>

      <ListItem id={1} name="Games Played" value={gamesPlayed} color="yellow" />
      <ListItem
        id={2}
        name="Total User Score"
        value={totalUserScore}
        color="green"
      />
      <ListItem
        id={3}
        name="Total Team Score"
        value={totalTeamScore}
        color="blue"
      />
    </VStack>
  );
}

export default Data;

function getBadgeType(points) {
  if (points <= 10) return { type: "Bronze", color: "brown" };
  if (points <= 20) return { type: "Silver", color: "silver" };
  if (points <= 30) return { type: "Gold", color: "gold" };
  return { type: "Platinum", color: "platinum" };
}
