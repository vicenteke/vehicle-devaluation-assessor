'use client';
import {
  Flex,
  Heading,
  Text
} from "@chakra-ui/react";
import Background from "@/components/Background";
import AssessmentCard from "@/components/AssessmentCard";

 
export default function Home() {
  return (
    <main>
      <Background />
      <Flex
          w='100%' minH='100vh'
          flexDir='column'
          alignItems='center'
          pt='5em'
          px='6em'>
        <Flex
          flexDir='column'
          alignItems='center'
          style={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <Heading
            as='h1'
            size='3xl'
            color='teal.500'
            pb='5px'
          >
            Vehicle Depreciation Assessor
          </Heading>
          <Text size='xl'>
            Check how much has your vehicle devaluated since you bought it. Note that it applies to Brazil only.
          </Text>
        </Flex>
        <AssessmentCard
          w='xl'
          maxW='xl'
          alignSelf='center'
          mt='4em'
        />
      </Flex>
    </main>
  );
}
