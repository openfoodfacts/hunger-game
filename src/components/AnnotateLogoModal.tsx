import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import LogoForm from "./LogoForm";
import LogoGrid from "./LogoGrid";
import robotoff from "../robotoff";
import { IS_DEVELOPMENT_MODE } from "../const";
import { useMatomoTrackAnswerQuestion } from "../hooks/matomoEvents";

const AnnotateLogoModal = (props) => {
  const {
    isOpen,
    logos,
    closeAnnotation,
    toggleLogoSelection,
    afterAnnotation,
    value = "",
    type = "",
    game = "unknown",
  } = props;

  const { annotateLogo: matomoTrackLogoAnnotation } =
    useMatomoTrackAnswerQuestion();

  const sendAnnotation = async ({ type, value }) => {
    try {
      if (!IS_DEVELOPMENT_MODE) {
        await robotoff.annotateLogos(
          logos
            .filter((logo) => logo.selected)
            .map(({ id }) => ({
              logo_id: id,
              value,
              type,
            }))
        );
        matomoTrackLogoAnnotation({
          game,
          type,
          value,
          number: logos.filter((logo) => logo.selected).length,
        });
      }
      logos
        .filter((logo) => logo.selected)
        .forEach(({ id }) => {
          toggleLogoSelection(id);
        });
      closeAnnotation();
      afterAnnotation?.(
        logos.filter((logo) => logo.selected),
        { value, type }
      );
      // eslint-disable-next-line no-empty
    } catch {}
  };
  return (
    <Dialog open={isOpen} onClose={closeAnnotation} maxWidth="xl">
      <DialogContent>
        <Typography variant="h5">Selected logos</Typography>
        <LogoGrid
          logos={logos.filter((logo) => logo.selected)}
          toggleLogoSelection={toggleLogoSelection}
          sx={{ padding: 0 }}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <LogoForm
          value={value}
          type={type}
          request={sendAnnotation}
          sx={{ padding: [2, 4] }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AnnotateLogoModal;
