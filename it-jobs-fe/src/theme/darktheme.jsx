import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
    palette:{
        mode: "dark",
        background: {
            default: "#0c071b"
        },
        text:{
            primary: "#fff"
        },
        primary:{
            main: "rgba(106,145,255,0.507)"
        }

    }
})