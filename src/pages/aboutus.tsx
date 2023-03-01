import { Typography, Row, Divider } from 'antd';

const { Title, Paragraph } = Typography;

const styles = {  

  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
    marginTop: '50px',
  },

  paragraph: {
    fontSize: '24px',
    color: '#666',
    marginBottom: '32px',
    maxWidth: '600px',
  },

}

const AboutUs = () => {
  return (
    <>
    <header>
      <Divider orientation="center" >
        <Title level={4} style={styles.title}>About Us</Title>
      </Divider>
      </header>
      <Row gutter={[16, 16]} justify="center">
        <Paragraph style={styles.paragraph}>
        Welcome to our Thesis Abstract Management System for the College of Engineering in Morong Rizal! We are a team of undergraduate 
        computer engineering students from the University of Rizal System in Morong Rizal, Philippines. Our goal is to provide a 
        user-friendly and efficient system for managing thesis abstract submissions for the College of Engineering.
        </Paragraph>
      </Row>
    </>
  );
};

export default AboutUs;
