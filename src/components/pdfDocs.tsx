import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  BlobProvider,
} from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Section #1</Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

const PdfDownloadLink = () => (
  <BlobProvider document={<MyDocument />}>
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
