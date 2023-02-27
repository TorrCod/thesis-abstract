import { Form, Modal } from "antd";
import { useState } from "react";
import { PriButton } from "./button";

function Login() {
  const [openModal, setOpenModal] = useState(false)

  return (
    <>
      <PriButton onClick={()=>setOpenModal(true)}>Signin / Sign Up</PriButton>
      <Modal open={openModal} onCancel={()=>setOpenModal(false)} onOk={()=>{}}>
        <Form>
          SignIn Mamaya na lang uli
        </Form>
      </Modal>
    </>
  );
}

export default Login;
