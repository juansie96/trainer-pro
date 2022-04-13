import { OutlinedTextFieldProps, TextField, TextFieldProps } from "@mui/material";
import {
  useController,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";

interface InputProps extends OutlinedTextFieldProps {
  control: UseControllerProps<any> 
}

export function Input( { control, ...props }: InputProps) {
  
  const { field, fieldState } = useController(control); // { formState }
  const { onChange, onBlur, name, value, ref } = field;
  const { invalid } = fieldState; 

  const dt = useFormContext()

  return (
    <TextField
      onChange={onChange} // send value to hook form
      onBlur={onBlur} // notify when input is touched/blur
      value={value} // input value
      name={name} // send down the input name
      inputRef={ref} // send input ref, so we can focus on input when error appear
      error={invalid}
      fullWidth={true}
      label={name}
      {...props}
    />
  );
}
