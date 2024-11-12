import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Header from "../src/components/navbar/Header";
import Home from "../src/components/home/Home";

function App() {
  return (
    <>
      <div className="">
        <Header />
        <Home />
      </div>
    </>
  );
}

export default App;
