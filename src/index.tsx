import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import "index.scss";

import GradientCardList from "examples/list/components/gradient-card-list/gradient-card-list";
import GradientCardMasonry from "examples/masonry/components/gradient-card-masonry";

ReactDOM.render(
  <BrowserRouter>
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <Link to="/">
        <h1>List</h1>
      </Link>

      <Link to="/masonry">
        <h1>Masonry</h1>
      </Link>
    </div>

    <Switch>
      <Route path="/masonry">
        <GradientCardMasonry />
      </Route>

      <Route path="/">
        <GradientCardList />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
