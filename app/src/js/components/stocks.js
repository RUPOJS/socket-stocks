import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment'
import * as ChatActions from './../actions/ActionsCreators.js';



function mapStateToProps(state) {
  return {
    messages: state.messages,
    isConnected : state.messages.status
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ChatActions, dispatch)
  };
}


class Stocks extends React.Component {

  componentWillMount() {
    //Starting To Mount;
    console.log('MOUNTING');
  }

  componentDidMount() {
    console.log('MOUNTED, NOW CONNECT TO STORE');
    setTimeout(() => {
      this.props.actions.connect();
    }, 0);    
    
    // this.props.actions.receiveMessage();
  }

  calculateTimeDiff(last_updated) {
    const before = moment(last_updated,'YYYY.MM.DD HH:mm');
    const now = moment();

    const diff = moment.duration(moment(now).diff(moment(before)));

    let exactTimeDiff = '';

    if (diff._data.days > 0) {
      exactTimeDiff += diff._data.seconds + ' days,'
    }    
    if (diff._data.hours > 0) {
      exactTimeDiff += diff._data.seconds + ' hours,'
    }
    if (diff._data.minutes > 0) {
      exactTimeDiff += diff._data.seconds + ' minutes,'
    }
    if (diff._data.seconds > 0) {
      exactTimeDiff += diff._data.seconds + ' seconds ago'
    } else {
      exactTimeDiff = 'a few seconds ago';
    }

    return exactTimeDiff;
  }

  calculatePercentageDiff(current_price, last_price) {
    if (!current_price || !last_price) {
      return '';
    }
    const percentageDiff = 100 * ((current_price - last_price) / ((current_price+last_price)/2 ));

    if (percentageDiff < 0) {
      return {'val': percentageDiff + '%', 'toShowUp': false, 'toShowDown': true};
    } else {
      return {'val': percentageDiff + '%', 'toShowUp': true, 'toShowDown': false};
    }
  }

  render(){
    const { messages } = this.props;
    return (
      <div>
        <section>
          <h1>Latest Stock Price</h1>
          <div className="tbl-header">
            <table cellPadding={0} cellSpacing={0} border={0}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Price</th>
                  <th>% Change</th>
                  <th>Last Updated</th>
                  <th>History</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="tbl-content">
            <table cellPadding={0} cellSpacing={0} border={0}>
              <tbody>
                {Object.keys(messages.stocks).map(msg =>
                  <tr>
                  <td>{messages.stocks[msg]['name']}</td>
                  <td>{messages.stocks[msg]['price'][0]}</td>
                  <td style={{ color: this.calculatePercentageDiff(messages.stocks[msg]['price'][0], messages.stocks[msg]['price'][1]).toShowUp ? '#127912': '#811818'}}>{this.calculatePercentageDiff(messages.stocks[msg]['price'][0], messages.stocks[msg]['price'][1]).val}</td>
                  <td>{this.calculateTimeDiff(messages.stocks[msg]['updated_at'][0])}</td>
                  <td></td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <div></div>
        </section>
      </div>
    );

  }

}



export default connect(mapStateToProps, mapDispatchToProps)(Stocks);
