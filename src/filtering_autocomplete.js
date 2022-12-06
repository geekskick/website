import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { debounce } from "lodash"
import React from "react";

export default function FilteringAutocomplete(props) {

    const _filterOptions = createFilterOptions();

    const debouncedSetFilteredOptions = React.useRef(
        debounce(criteria => {
            props.onNewFilteredList(criteria);
        }, props.debounceTimeMs)
    ).current;

    React.useEffect(() => {
        return () => {
            debouncedSetFilteredOptions.cancel();
        };
    }, [debouncedSetFilteredOptions]);


    const filterOptions = React.useCallback((options, state) => {
        const results = _filterOptions(options, state);
        // This callback gets called loads when the user has focus on the autocomplete box
        // so deboucing is needed here to prevent it all locking up
        debouncedSetFilteredOptions(results.map(option => option.id));
        return results;
    }, [_filterOptions, debouncedSetFilteredOptions]);


    return (<Autocomplete
        autoComplete
        options={props.optionsSuperSet}
        filterOptions={filterOptions}
        onChange={((event, newValue) => {
            console.log(event);
            debouncedSetFilteredOptions([newValue.id]);
            props.onSelect(newValue.id);
        })}
        renderInput={(params) => <TextField {...params} label={props.label} />}
    />);
}