import { Box, Text, VStack } from "@chakra-ui/react";

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
    >
      <Text color="brand.dark">{name}</Text>
      <Text color={`brand.${color}`} fontWeight="bold">
        {value}
      </Text>
    </Box>
  );
}

function Data() {
  return (
    <VStack as="ul" spacing={0} listStyleType="none">
      <ListItem id={1} name="Games Played" value={32} color="yellow" />
      <ListItem id={2} name="Win/Loss Ratio" value={26} color="green" />
      <ListItem id={3} name="Total Points Earned" value={6} color="blue" />
    </VStack>
  );
}

export default Data;
