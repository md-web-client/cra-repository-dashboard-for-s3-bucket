import React, { Fragment } from 'react';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
const { AltItem } = require('./altItem.js')
const { PinnedElement } = require('./PinnedElement.js')
const { NotSure, SubmitOrError } = require('./unknownLogic.js')
const { Header, Dropdown } = require('./Components.js')



const ListItem = ({repo, user, description, starCount, majorityLanguage, languageColor}) => {

  return (
    <li className="pinned-item-list-item  p-3 mb-3 border border-gray-dark rounded-1 js-pinned-item-list-item public source reorderable sortable-button-item">
      <PinnedElement info={{ repo, user, description, starCount, majorityLanguage, languageColor }} />
    </li>
  );
}

const NewItem = ({ info:{repo, user, description, starCount, majorityLanguage, languageColor}}) => {

  return (
    <li className="pinned-item-list-item  p-3 mb-3 border border-gray-dark rounded-1 js-pinned-item-list-item public source reorderable sortable-button-item">
      <PinnedElement info={{ repo, user, description, starCount, majorityLanguage, languageColor }} />
    </li>
);
}

const SortableItem = SortableElement( ({repoOrderValue, index, listOfAllRepos}) => {
  // console.log({repoOrderValue, repo: listOfAllRepos[repoOrderValue]})
  return <NewItem key={`item-${index}`} info={listOfAllRepos[repoOrderValue]} />
})
const OrgComponent = ({listOrgs, login, avatar_url, handleClick}) => {
  const orgSelected = listOrgs.includes(login)
  return <span title={login} onClick={(e)=> { handleClick(e, login, orgSelected)} } style={{position: 'relative'}}>
    { orgSelected ? <input className="checkLabel" type="checkbox" name="vehicle3" value="Boat" checked /> : '' }
    <img className={ orgSelected ? "selected" : ''} style={{margin: '10px'}} height="50" width="50" src={avatar_url} />
  </span>
}
const SortableList = SortableContainer(({orderList, listOfAllRepos}) =>{
  return <ol className="thing try js-pinned-items-reorder-list" >
    {
    orderList.map((repoOrderValue, index) => (
        <SortableItem key={`item-${index}`} listOfAllRepos={listOfAllRepos} index={index} repoOrderValue={repoOrderValue}/>
      ))}
   </ol>
 })
class PinnedScrollbar extends React.Component {
  constructor() {
    super();
    this.state = {
      listOrgs: ['jax-ex'],
      trimmedData: [],
      // arr: ["De-Nest","the_willywanka_gitfactory",1,0,-"the_willywanka_gitfactory",-2],
      // listOfAllRepos: [
      //  "De-Nest":{ // list of repos:
      //  },
      // }
      // not sure how I would do this or if it would be useful: thisPageTwentyFirstRepos:[],
      arr: [0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3,3,2,1,0,-1,-2], // id's /* the numbers here will be id's and list of repos will change to object. */ 
      
      // id's could be formed by names. converted to hex.
      // alternatively, load the entire list from database ...
      // provide a user experience in the meantime.

      // store everything as a service worker session.
      // every action update chrome and send a request to the database.

      // If network request fails go to offline mode on service worker.
      // when internet reestablished send all repos and orders to database.
      // or diff ... from offline mode to online mode. and send just those updates.
      // example ... store failed network requests.
      // resolve counteracting network requests.

      orderList:[],
      listOfAllRepos: [
        { // list of repos:
          repo: "De-Nest",
          user: "MichaelDimmitt",
          starCount: 1,
          majorityLanguage: "Javascript",
          languageColor: "#f1e05a",
          description: "flatten_a_deeply_nested_object-or-array, just print out all the keys, just print out all the values. format the stuff do the things."
        },
        {
          repo:"the_willywanka_gitfactory",
          user:"MichaelDimmitt",
          starCount:3,
          majorityLanguage:"Shell",
          languageColor:"#89e051",
          description:"Want me to build you something in git? open an issue or direct message me on slack. 😁 "
        },
        {
          repo:"emoji-terminal",
          user:"MichaelDimmitt",
          starCount:4,
          majorityLanguage:"Shell",
          languageColor:"#89e051",
          description:" 😂 🤖 🤓 😲 🤑 😎 🤔 👌 😍 🔥 🔥 🔥 🤗 - supports all terminal shells"
        },
        {
          repo:"ERRORSCREAM",
          user:"MichaelDimmitt",
          starCount:1,
          majorityLanguage:"Shell",
          languageColor:"#89e051",
          description:"stdout to error"
        }
      ]
    }
    this.state.orderList = this.state.arr.filter(x => Math.sign(x) > -1 );
    this.onSortEnd = this.onSortEnd.bind(this)
  };

  async componentDidMount() {
    // const repos = await fetch(`https://api.github.com/users/michaeldimmitt/repos`)
    let repos = (await localStorage.getItem('orgs')) || (await fetch(`https://api.github.com/users/michaeldimmitt/orgs`).then(x => x.json()))
    if(repos && typeof repos.valueOf() === "string"){
      repos = JSON.parse(repos)
    }
    console.log({repos})
    const trimmedData = repos.map( repo => {
      const {avatar_url, login} = repo
      console.log({repo}, repo.avatar_url, repo.login)
      return { avatar_url, login }
    })
    this.setState({trimmedData})
    localStorage.setItem('orgs', JSON.stringify(trimmedData))
    // const trimmedData = repos.map( repo => {
    //   return {
    //     repo: repo.name,
    //     user: repo.owner.login,
    //     starCount: repo.stargazers_count,
    //     majorityLanguage: repo.language,
    //     languageColor: "#89e051",
    //     description: repo.description
    //   }
    // })
    // console.log({trimmedData})
      
      // color needs to be handled differently.


    
    // let token = await localStorage.getItem('githubToken')
    // const code = window.location.href.split('?code=');
    // if(token && code) {  
    //   const baseUrl = code[0]
    //   window.history.pushState({}, null, code[0]);
    // }
    // else if(!token && code.length === 1) {

    // }
    // else {
    //   console.log({token, code})
    //   token = code[1]
    //   const baseUrl = code[0]
    //   console.log({baseUrl})
    //   localStorage.setItem('githubToken', token)
    //   window.history.pushState({}, null, baseUrl);
    // }
  }
  onSortEnd({oldIndex, newIndex}) {
    console.log({oldIndex, newIndex})
    console.log('reaaached')
    this.setState({
      orderList: arrayMove(this.state.orderList, oldIndex, newIndex)
    });
  };

  makeNegative({index, arr, orderList}) {
    console.log('oxxxxxxhxhxhxhhxh')
    console.log(orderList)
    const arrIndex = arr.indexOf(orderList[index])
    if( Math.sign(arr[arrIndex] !== -1)) {
      arr[arrIndex] *= -1
      this.setState({
        arr:arr
      })
    }
  }

  componentDidUpdate() {
    console.log('hi',this.state.orderList,'hi')
  }
  handleClick(e, login, orgSelected) {
    e.preventDefault();
    let listOrgs = this.state.listOrgs;

    if(orgSelected){
      // exists in list needs to be removed
      listOrgs = listOrgs.filter(e => e !== login)
      this.setState({listOrgs})
    }
    else {
      // not in list needs to be added
      listOrgs.push(login)
      this.setState({listOrgs})
    }
  }
  render() { /* classes used, externally, "js-pinned-repos-reorder-container" "js-pinned-repos-reorder-form" "js-pinned-repos-reorder-list" */
    return (
      <div className="mainy" >
        <div className="js-pinned-items-reorder-container" style={{padding: '10px 0px 0px 10px', flex:'12', justifyContent:'space-evenly'}}> {/*element needed for error message*/}
          <div style={{margin: '0px auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '770px'}}>
            { 
              this.state.trimmedData && this.state.trimmedData.map( ({avatar_url, login}) => 
                <OrgComponent listOrgs={this.state.listOrgs} login={login} avatar_url={avatar_url} handleClick={this.handleClick.bind(this)}/> 
              )
            }
          </div>

          <br/>
          <Header/>
          <br/>
          {/* <button type="submit" onClick={() => this.makeNegative({index:1, arr: this.state.arr, orderList:this.state.orderList})}></button> */}
          <form className="js-pinned-items-reorder-form" id="user-11463275-pinned-items-reorder-form" action="/users/MichaelDimmitt/reorder_pinned_items" acceptCharset="UTF-8" method="post"><input name="utf8" type="hidden" value="&#x2713;" /><input type="hidden" name="_method" value="put" /><input type="hidden" name="authenticity_token" value="ZPGZVl0xvQsVNRLfBda3s0M0/ktKPUH3MUUP9Ije3rIQMF3yEFbK7nja8x/SBhbWvgsQWEQ/9ySjoAeRmBJwTA==" /> {/*element needed for error message*/}
              <SortableList axis="xy" orderList={this.state.orderList} listOfAllRepos={this.state.listOfAllRepos} onSortEnd={this.onSortEnd} useDragHandle/>
            {/* <SubmitOrError/> */}
          </form>
        </div>
        {/* <a href="http://github.com/login/oauth/authorize?client_id=76b80b0af7dfb2ff4916&redirect_uri=http://127.0.0.1:3000/">
          Login
        </a>
        <Dropdown/> */}
      </div>
    );
  }
}

export default PinnedScrollbar;

