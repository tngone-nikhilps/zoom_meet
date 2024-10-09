import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.min.css";
import PreviewContainer from "./components/pages/preview";

function App() {
  const [isSupportGalleryView, setIsSupportGalleryView] =
    useState<boolean>(false);
  // const galleryViewWithAttach = Number(useVideoPlayer) === 1 && (window.crossOriginIsolated || galleryViewWithoutSAB);

  return (
    <Router>
      <Switch>
        {/* <Route
        path="/video"
        component={isSupportGalleryView ? (galleryViewWithAttach ? VideoAttach : Video) : VideoSingle}
      /> */}

        <Route path="/preview" component={PreviewContainer} />
      </Switch>
    </Router>
  );
}

export default App;
