import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import nricValidator from "./SingaporeNricValidator";
import logo from "../assets/img/give-love.png";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://amilhasbala.com/">
        Amil Hasbala
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function DonationForm() {
  const postalRegex = /\d{6}/g;

  const unitRegex = /^([a-zA-Z0-9]*-[a-zA-Z0-9]*)+$/g;

  function isNumeric(value) {
    return /^-?\d+$/.test(value);
  }

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().min(2).max(128).required(),
    amount: yup.number().positive().required(),
    nirc: yup
      .string()
      .test({
        name: "is-nirc",
        skipAbsent: true,
        test(value, ctx) {
          if (!nricValidator(value)) {
            return ctx.createError({ message: "Invalid NIRC" });
          }
          return true;
        },
      })
      .required(),
    postal: yup
      .string()
      .length(6)
      .matches(postalRegex, "Invalid Postal Code")
      .required(),
    unit: yup
      .string()
      .max(6)
      .matches(unitRegex, '6 digit with hypen "-", hint: A-1234 ')
      .required(),
    address: yup.string().test({
      name: "is-address",
      skipAbsent: true,
      test(value, ctx) {
        if (isNumeric(value)) {
          return ctx.createError({ message: "Invalid Address" });
        }
        return true;
      },
    }),
    remark: yup.string(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = (data) => {
    alert(`Thanks ${data.name}, for SGD ${data.amount} donation`);
    reset();
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/LZ8NzZrByts)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar src={logo} sx={{ width: 100, height: 100 }}></Avatar>
            <Typography component="h1" variant="h5">
              Donate Yuk!
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmitHandler)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="amount"
                label="Donation Amount"
                name="amount"
                {...register("amount")}
                error={!!errors.amount}
                helperText={errors.amount?.message}
                type="number"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name")}
                name="name"
                autoComplete="name"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                {...register("email")}
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="nirc"
                label="ID Card Number"
                name="nirc"
                autoComplete="nirc"
                {...register("nirc")}
                error={!!errors.nirc}
                helperText={errors.nirc?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="postal"
                type="number"
                label="Postal Code"
                name="postal"
                autoComplete="postal"
                {...register("postal")}
                error={!!errors.postal}
                helperText={errors.postal?.message}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="unit"
                label="Unit Number"
                name="unit"
                autoComplete="unit"
                {...register("unit")}
                error={!!errors.unit}
                helperText={errors.unit?.message}
              />
              <TextField
                margin="normal"
                fullWidth
                id="address"
                label="Address"
                name="address"
                autoComplete="address"
                {...register("address")}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
              <TextField
                margin="normal"
                fullWidth
                id="remark"
                label="Remarks"
                name="remark"
                autoComplete="remark"
                {...register("remark")}
                error={!!errors.remark}
                helperText={errors.remark?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Donate
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
