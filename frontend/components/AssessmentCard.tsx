import React, { FC } from "react";
import {
  Card,
  CardBody,
  CardProps,
} from "@chakra-ui/react";
import AssessmentForm from "./AssessmentForm";
import AssessmentResults from "./AssessmentResults";


const AssessmentCard: FC<CardProps> = (props: CardProps) => {
  return <Card {...props}>
    <CardBody>
      <AssessmentForm />
      <AssessmentResults />
    </CardBody>
  </Card>;
}

export default AssessmentCard;
