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
      {props.abstract.map((url) => (
        <Image src={url} />
      ))}
    </Page>
  </Document>
  // <Document>
  //   <Page size="LETTER" style={styles.page}>
  //     <View style={{ textAlign: "center" }}>
  //       <Text>ABSTRACT</Text>
  //     </View>
  //     <View style={styles.twoColumn}>
  //       <View style={styles.twoColumn1Item}>
  //         <Text>Title:</Text>
  //       </View>
  //       <View style={styles.twoColumn2Item}>
  //         <Text style={{ flex: 1, flexWrap: "wrap" }}>{props.title}</Text>
  //       </View>
  //     </View>
  //     <View style={styles.twoColumn}>
  //       <View style={styles.twoColumn1Item}>
  //         <Text>Year:</Text>
  //       </View>
  //       <View style={styles.twoColumn2Item}>
  //         <Text>{props.year}</Text>
  //       </View>
  //     </View>
  //     <View style={styles.twoColumn}>
  //       <View style={styles.twoColumn1Item}>
  //         <Text>Course:</Text>
  //       </View>
  //       <View style={styles.twoColumn2Item}>
  //         <Text>{props.course}</Text>
  //       </View>
  //     </View>
  //     <View style={{ ...styles.twoColumn }}>
  //       <View style={styles.twoColumn1Item}>
  //         <Text>Authors:</Text>
  //       </View>
  //       <View
  //         style={{
  //           ...styles.twoColumn2Item,
  //           flexDirection: "column",
  //         }}
  //       >
  //         {props.researchers.map((child, index) => (
  //           <Text key={index}>{`\u2022 ${child}`}</Text>
  //         ))}
  //       </View>
  //     </View>
  //     <View style={styles.body}>
  //       <Text
  //         style={{
  //           textIndent: "50px",
  //         }}
  //       >
  //         {props.abstract}
  //       </Text>
  //     </View>
  //   </Page>
  // </Document>
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
