import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function AdditionalNutriments({options, setNutriments}) {

  const [inputValue, setInputValue] = React.useState('')

  return (
    <Autocomplete
      value={null}
      disablePortal
      id="nutrition-input"
      options={options}
      sx={{ width: 245, marginLeft: 2, marginTop: 2 }}
      onChange={event => {
        const nutrName = event.target.innerText
          setNutriments(prev => prev.map( nutr => nutr.label === nutrName ? ({...nutr, display: true}) : nutr))
          setInputValue("")
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue)
      }}
      renderInput={(params) => <TextField {...params} label="Add nutriment" />}
    />
  );
}

