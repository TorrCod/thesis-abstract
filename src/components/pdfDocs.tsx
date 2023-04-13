import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  BlobProvider,
  Font,
  Image,
} from "@react-pdf/renderer";
import { ThesisItems } from "@/context/types.d";

// Register font
Font.register({
  family: "Ubuntu",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf",
      fontWeight: "bold",
    },
    {
      src: "https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf",
      fontWeight: "normal",
      fontStyle: "italic",
    },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

// Create styles
const styles = StyleSheet.create({
  page: {},
});
// const styles = StyleSheet.create({
//   page: {
//     paddingLeft: "1.5in",
//     paddingVertical: "1in",
//     paddingRight: "1in",
//     backgroundColor: "#E4E4E4",
//     fontSize: "12px",
//     lineHeight: 2,
//     textAlign: "justify",
//     fontFamily: "Ubuntu",
//   },
//   twoColumn: {
//     flexDirection: "row",
//     width: "100%",
//     position: "relative",
//   },
//   twoColumn1Item: {
//     width: "20%",
//   },
//   twoColumn2Item: {
//     flexDirection: "row",
//     position: "relative",
//     flexWrap: "wrap",
//     width: "100%",
//   },
//   body: {
//     paddingTop: "20px",
//   },
// });

// Create Document Component
const MyDocument = (props: ThesisItems) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      {props.abstract.map((url, index) => (
        // <Image key={index} src={url} />
        <Image
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            objectFit: "fill",
          }}
          source={url}
          key={index}
        />
      ))}
    </Page>
  </Document>
);

const PdfDownloadLink = (props: ThesisItems) => (
  <BlobProvider document={<MyDocument {...props} />}>
    {({ blob, url, loading, error }) =>
      loading ? (
        "Loading document..."
      ) : (
        <a href={url!} target="_blank" rel="noopener noreferrer">
          Download PDF
        </a>
      )
    }
  </BlobProvider>
);

export default PdfDownloadLink;
