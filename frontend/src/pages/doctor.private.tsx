import React, { Component } from "react";
import { Div } from "../styles/pages.style";

/*
Once logged in as an DOCTOR
*/
export default class DoctorPrivate extends Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      profile: false,
      record: false,
      access: false,
      authorized: false,
      emergency: false,
    }
  }

  render() {
    return (
      <Div>
        <h1>STATUS: {this.props.loggedInStatus}</h1>
        <div>
          <h3>HI DOCTOR</h3>
        </div>
      </Div>
    );
  }
}
