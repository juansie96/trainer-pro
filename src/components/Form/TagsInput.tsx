import { Autocomplete, Chip, TextField } from "@mui/material";
import React from "react";
import { Control, Controller } from "react-hook-form";

interface TagsInputProps {
  control?: Control<any>;
  label: string;
  placeholder: string;
}

export const TagsInput: React.FC<TagsInputProps> = ({control, label, placeholder}) => {
  return (
    <Controller
      name="tags"
      control={control}
      render={({ field }) => (
        <Autocomplete
          sx={{ mt: 2 }}
          fullWidth
          multiple
          id="tags-filled"
          options={[]}
          defaultValue={[]}
          freeSolo
          onChange={(e, value) => field.onChange(value)}
          renderTags={(
            value: any[],
            getTagProps: (arg0: { index: any }) => JSX.IntrinsicAttributes
          ) =>
            value.map((option: any, index: any) => {
              return (
                <Chip
                  key={index}
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              );
            })
          }
          renderInput={(params: any) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder}
            />
          )}
        />
      )}
    />
  );
};
