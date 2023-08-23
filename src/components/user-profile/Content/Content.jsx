import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import AccountSettings from "./AccountSettings";
import TeamAffiliations from "./TeamAffiliations";
import CompareAchievements from "./CompareAchievement";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../../services/userApi";

const Content = () => {
  const tabs = ["User Profile", "Team Affiliations", "Compare Achievements"];
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    email &&
      getUserProfile(email)
        .then((res) => {
          console.log("user data ==>", res);
          setUserData(res.data.user);
        })
        .catch((err) =>
          console.log("error fetching user data catch block ==>", err)
        );
  }, []);
  console.log("userdatra ==>", userData);
  return (
    <Box
      as="main"
      flex={3}
      d="flex"
      flexDir="column"
      justifyContent="space-between"
      pt={5}
      bg="white"
      rounded="md"
      borderWidth={1}
      borderColor="gray.200"
    >
      <Tabs>
        <TabList px={5}>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              mx={3}
              px={0}
              py={3}
              fontWeight="semibold"
              color="brand.cadet"
              borderBottomWidth={1}
              _active={{ bg: "transparent" }}
              _selected={{ color: "brand.dark", borderColor: "brand.blue" }}
            >
              {tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels px={3} mt={5}>
          <TabPanel>
            <AccountSettings userData={userData} />
          </TabPanel>
          <TabPanel>
            {userData?.team_id && (
              <TeamAffiliations
                teamId={userData?.team_id}
                isTeamOwner={userData?.isTeamOwner}
                email={userData?.email}
              />
            )}
          </TabPanel>
          <TabPanel>
            <CompareAchievements />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Content;
