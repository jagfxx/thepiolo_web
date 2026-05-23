import { Font } from "@react-pdf/renderer";
import path from "path";

const root = process.cwd();

Font.register({
  family: "Montserrat",
  fonts: [
    {
      src: path.join(
        root,
        "node_modules/@fontsource/montserrat/files/montserrat-latin-400-normal.woff",
      ),
      fontWeight: 400,
    },
    {
      src: path.join(
        root,
        "node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff",
      ),
      fontWeight: 600,
    },
  ],
});

Font.register({
  family: "Syne",
  fonts: [
    {
      src: path.join(
        root,
        "node_modules/@fontsource/syne/files/syne-latin-600-normal.woff",
      ),
      fontWeight: 600,
    },
  ],
});
