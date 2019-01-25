import React from "react";
import { connect } from "react-redux";

class Main extends React.PureComponent {
  render() {
    console.info(this.props);
    return <div>{this.props.name}</div>;
  }
}

const mapStateToProps = state => {
  return {
    name: state.app.home.name
  };
};

export default connect(mapStateToProps)(Main);
