// src/components/Header.js
import { Layout } from "antd";
import logo from './logo.jpg';

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header
      className="custom-header"
      style={{
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #eee",
      }}
    >
      <img src={logo} alt="Logo" style={{ height: 40, marginRight: 16 }} />
      <h2
  style={{
    fontFamily: "'courgette', cursive",
    margin: 0,
    color: "black",
  }}
>
  📝 my blog-planner

</h2>

<h2
  style={{
    fontFamily: " cursive",
    margin:"0 20px",
    color: "black",

  }}>
    from crisis to dev
  </h2>
    </Header>
  );
};

export default AppHeader;
