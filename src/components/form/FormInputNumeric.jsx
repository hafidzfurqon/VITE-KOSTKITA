import { NumericFormat } from "react-number-format";
import { TextField, Typography } from "@mui/material";

export default function FormInputNumeric({ title, value, name, onValueChange, error }) {
  return (
    <div>
      {/* Label */}
      <Typography
        variant="body1"
        sx={{ mt: 2, mb: 1, fontWeight: "bold", color: error ? "error.main" : "text.primary" }}
      >
        {title} {error && "*"}
      </Typography>

      {/* Input dengan NumericFormat di dalam TextField */}
      <NumericFormat
        customInput={TextField}
        name={name}
        value={value}
        onValueChange={onValueChange}
        prefix="Rp "
        placeholder="Rp"
        allowLeadingZeros
        thousandSeparator=","
        fullWidth
        error={!!error}
        helperText={error}
        variant="outlined"
        sx={{ borderRadius: "8px" }}
      />
    </div>
  );
}
