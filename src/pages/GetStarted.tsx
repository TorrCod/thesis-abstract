import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  title: {
    gridColumn: "1 / span 6",
    textAlign: "center",
    fontSize: "27px",
    color: "white",
    marginBottom: "25px",
    marginTop: "50px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 0fr)",
    gridGap: "5px",
    padding: "20px",
    justifyContent: "center",
    alignContent: "center",
  },
  block: {
    backgroundColor: "#F5E5E5",
    height: "400px",
    width: "600px",
    borderRadius: "10px",
    boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.5)",
    padding: "20px",
  },
  //First to Last steps
  first: {
    gridColumn: "1 / span 2",
    gridRow: "2",
  },
  second: {
    gridColumn: "2 / span 2",
    gridRow: "3",
  },
  third: {
    gridColumn: "1 / span 2",
    gridRow: "4",
  },
  fourth: {
    gridColumn: "2 / span 2",
    gridRow: "5",
  },
  fifth: {
    gridColumn: "1 / span 2",
    gridRow: "6",
  },
};

function GetStarted() {
  return (
    <>
      <div style={styles.container}>
        <div style={{ ...styles.title }}>
          Step by step guide on how to use our application and how it works:
        </div>
        <div style={{ ...styles.block, ...styles.first }}>
          <h1>Step 1: Enter Your Search Terms</h1>
          <p>
            Once you have accessed the website, you will see a search bar. Enter
            the keywords or phrases that you want to search for in this bar.
          </p>
        </div>
        <div style={{ ...styles.block, ...styles.second }}>
          <h1>Step 2: Refine your Search</h1>
          <p>
            If you have a large number of results, you may want to refine your
            search by using the filters provided on the website. These filters
            may include the course and the year of publication.
          </p>
        </div>
        <div style={{ ...styles.block, ...styles.third }}>
          <h1>Step 3: View Your Results</h1>
          <p>
            Once you have entered your search terms and applied any necessary
            filters, click on the &quot;Search&quot; button to view your
            results. You will see a list of theses that match your search
            criteria.
          </p>
        </div>
        <div style={{ ...styles.block, ...styles.fourth }}>
          <h1>Step 4: View Thesis Details</h1>
          <p>
            To view more information about a particular thesis, click on the
            title of the thesis. This will take you to a page with more details
            about the thesis, including the author&apos;s name, the abstract,
            and the publication information.
          </p>
        </div>
        <div style={{ ...styles.block, ...styles.fifth }}>
          <h1>Step 5: Download the PDF file</h1>
          <p>
            If you want to download the full text of a thesis, check if it is
            available for download. If it is, simply click on the download
            button to get a copy of the thesis.
          </p>
        </div>
      </div>
    </>
  );
}

export default GetStarted;
