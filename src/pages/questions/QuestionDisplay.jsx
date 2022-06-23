import * as React from "react";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinkIcon from "@mui/icons-material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { useTranslation } from "react-i18next";
import { NO_QUESTION_LEFT, OFF_URL } from "../../const";
import { reformatValueTag } from "../../utils";
import { Box } from "@mui/system";

const getValueTagQuestionsURL = (question) => {
  if (
    question !== null &&
    question !== NO_QUESTION_LEFT &&
    question.value_tag
  ) {
    const urlParams = new URLSearchParams();
    urlParams.append("type", question.insight_type);
    urlParams.append("value_tag", reformatValueTag(question.value_tag));
    return `/questions?${urlParams.toString()}`;
  }
  return null;
};
const getValueTagExamplesURL = (question) => {
  if (
    question !== null &&
    question !== NO_QUESTION_LEFT &&
    question.value_tag &&
    question.insight_type
  ) {
    return `${OFF_URL}/${question.insight_type}/${reformatValueTag(
      question.value_tag
    )}`;
  }
  return "";
};

const QuestionDisplay = ({ question, answerQuestion }) => {
  const { t } = useTranslation();
  const valueTagQuestionsURL = getValueTagQuestionsURL(question);
  const valueTagExamplesURL = getValueTagExamplesURL(question);

  if (question === NO_QUESTION_LEFT) {
    return <p>{t("questions.no_questions_remaining")}</p>;
  }
  if (question === null) {
    return <p>loading</p>;
  }
  return (
    <Stack
      sx={{
        textAlign: "center",
        flexGrow: 1,
        flexBasis: 0,
        flexShrink: 1,
      }}
    >
      <Typography>{question?.question}</Typography>
      {valueTagQuestionsURL && (
        <Button
          component={Link}
          to={valueTagQuestionsURL}
          endIcon={<LinkIcon />}
        >
          {question.value}
        </Button>
      )}
      {valueTagExamplesURL && (
        <a href={valueTagExamplesURL} target="_blank" rel="noreferrer">
          <div>{`${t("questions.see_examples")} ${question.insight_type}`}</div>
        </a>
      )}
      <Divider />
      <Box flexGrow={1} flexShrink={1} sx={{ height: 0, marginBottom: 1 }}>
        <Zoom wrapStyle={{ height: "100%" }}>
          <img
            src={
              question.source_image_url.replace("400.jpg", "jpg") ||
              "https://static.openfoodfacts.org/images/image-placeholder.png"
            }
            alt=""
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Zoom>
      </Box>
      <Stack
        direction="row"
        justifyContent="space-around"
        flexWrap="wrap"
        onKeyDown={(event) => {
          switch (event.key) {
            case "k":
              answerQuestion({ value: -1, insightId: question.insight_id });
              break;
            case "o":
              answerQuestion({ value: 1, insightId: question.insight_id });
              break;
            case "n":
              answerQuestion({ value: 0, insightId: question.insight_id });
              break;
            default:
              break;
          }
        }}
      >
        <Button
          onClick={() =>
            answerQuestion({ value: 0, insightId: question.insight_id })
          }
          startIcon={<DeleteIcon />}
          color="error"
          variant="contained"
          size="large"
        >
          {t("questions.no")} (n)
        </Button>
        <Button
          onClick={() =>
            answerQuestion({ value: -1, insightId: question.insight_id })
          }
          startIcon={<QuestionMarkIcon />}
          variant="contained"
          size="large"
          autoFocus
        >
          {t("questions.skip")} (k)
        </Button>
        <Button
          onClick={() =>
            answerQuestion({ value: 1, insightId: question.insight_id })
          }
          startIcon={<DoneIcon />}
          color="success"
          variant="contained"
          size="large"
        >
          {t("questions.yes")} (o)
        </Button>
      </Stack>
    </Stack>
  );
};
export default QuestionDisplay;
