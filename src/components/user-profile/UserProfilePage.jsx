import { Container } from "@chakra-ui/layout";
import Content from "./Content/Content";
import Sidebar from "./Sidebar/Sidebar";

export default function UserProfilePage() {
  return (
    <Container display={{ base: "block", md: "flex" }} maxW="container.xl">
      <Content />
    </Container>
  );
}
