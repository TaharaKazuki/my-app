import React, { Component } from 'react';

class SearchBar extends Component {
  render () {
    return (
     <div className="ui segment">
       <form className="ui form">
         <div className="field">
           <label>ImageSearch</label>
           <input type="text"/>
         </div>
       </form>
     </div>
    )
  }
}

export default SearchBar;