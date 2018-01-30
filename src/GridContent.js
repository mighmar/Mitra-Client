import React from 'react';
import ReactTooltip from 'react-tooltip'
import './App.css';
import GridRow from './GridRow';
import StylePanel from './StylePanel';
import update from 'react-addons-update';
import {globalCellStyleChange , cellStyleChange,globalCellValueChange,cellValueChange, globalOpenSheet, createSheet,openSheet, selectCell,onUserCellChange,selectCellUsers} from './api';
import { withAuth } from '@okta/okta-react';


const indexArray = function indexArray(len){
    let array = new Array(len);
    for (let i = 0; i < len; i++) {
            array[i]=i;
    }
    return array;
}



export default withAuth (class GridContent extends React.Component {
    constructor(props){
        super(props);
        
        this.state={
            userRowCol:{
                row:6,
                col:2
            },
            grid:{
            0:{
                1:"A", 2:"B",3:"C",4:"D",5:"E",6:"F",7:"G",8:"H",9:"I",10:"J",11:"K",
                12:"L",13:"M",14:"N",15:"O",16:"P",17:"Q",18:"R",19:"S",20:"T",21:"U",
                22:"V",23:"W",24:"X",25:"Y",26:"Z"
            },
            1:{0:1},2:{0:2},3:{0:3},4:{0:4},5:{0:5},6:{0:6},7:{0:7},8:{0:8},9:{0:9},10:{0:10},
            11:{0:11},12:{0:12},13:{0:13},14:{0:14},15:{0:15},16:{0:16},17:{0:17},18:{0:18},19:{0:19},
            20:{0:20},21:{0:21},22:{0:22},23:{0:23},24:{0:24},25:{0:25},26:{0:26},27:{0:27},28:{0:28},29:{0:29},
            30:{0:30},31:{0:31},32:{0:32},33:{0:33},34:{0:34},35:{0:35},36:{0:36},37:{0:37},38:{0:38},39:{0:39},40:{0:40}
            },
            gridStyles:{

            },
            gridFunctions:{

            }
        ,
            userSelection:[]
        ,
        userStyles:{}
        ,
        stylePanelVisible:false,
        documentationVisibility:false,
        colorPickerSelection:'#fff',
        fontFamilySelection:'Arial'
    };




    for (let i = 0; i < 40; i++) {
        for(let j = 0; j<27; j++){
            if(this.state.gridStyles[i]===undefined)
                this.state.gridStyles[i]={};
            if(this.state.gridStyles[i][j]===undefined)
                this.state.gridStyles[i][j]={};

                if(this.state.gridFunctions[i]===undefined)
                this.state.gridFunctions[i]={};
            if(this.state.gridFunctions[i][j]===undefined)
                this.state.gridFunctions[i][j]={};

            if(this.state.grid[i]===undefined)
                this.state.grid[i]={};
            if(this.state.grid[i][j]===undefined)
                this.state.grid[i][j]="";
        }
        
    }
    onUserCellChange(this.changeCellCallback.bind(this));
    globalOpenSheet(this.openSheetCallback.bind(this));
    globalCellValueChange(this.globalHandleCellValueChange.bind(this));
    globalCellStyleChange(this.globalHandleCellStyleChange.bind(this));
}



    changeCellCallback = (cellInfo)=>{
        //alert(JSON.stringify(cellInfo));
        let userSelection = cellInfo;
        this.setState({"userSelection":userSelection});
        this.refreshUserStyles(userSelection);
        //alert(JSON.stringify(cellInfo));
    }

    refreshUserStyles(userSelection){
        let userStyles={};
        for (const user in userSelection) {
                const element = userSelection[user];
                let colObj={};
                colObj={};
                colObj["border-style"]="solid";
                colObj["border-color"]=element.color;
                colObj["border-width"]="2px";
                //alert(element.row+"  "+JSON.stringify(colObj))
                if(userStyles[element.row]===undefined){
                    userStyles[element.row]={};
                }
                userStyles[element.row][element.col]=colObj;
        }

        this.setState({"userStyles":userStyles});

    }

    openSheetCallback = (sheetData)=>{
        //console.log(JSON.stringify(sheetData));
        let cellValues = sheetData.sheet.cells;
        for (const key in cellValues) {
            const element = cellValues[key];
            let i=element.row;
            let j=element.col;
            let value = element.value;
            this.setState((previousState) => {
                //console.log(i+" "+j+" "+value);
            return update(previousState, {
                grid:
                { 
                    [i]: {
                        [j]:{$set:[value]}
                        }
                    }
                }
            )
        }
            );
        }
        for (const key in cellValues) {
            const element = cellValues[key];
            let i=element.row;
            let j=element.col;
            let value = element.value;
            let style = element.style;
            if(value!== undefined){
                this.setState((previousState) => {
                    //console.log(i+" "+j+" "+value);
                return update(previousState, {
                            grid:
                            { 
                                [i]: {
                                    [j]:{$set:[value]}
                                    }
                                }
                            }
                        )
                }
                );
            }
            if(style!==undefined){
                this.setState((previousState) => {
                    //console.log(i+" "+j+" "+value);
                return update(previousState, {
                            gridStyles:
                            { 
                                [i]: {
                                    [j]:{$set:style}
                                    }
                                }
                            }
                        )
                }
                );
            }
        }
        let userSelection = sheetData["users"];
        /*let  userSelection = [
            {'username':'Filip','col':"5",'row':5, 'color':'coral'},
            {'username':'Marko','col':3,'row':2, 'color':'gold'}
        ];*/

        this.setState({"userSelection":userSelection});
        this.refreshUserStyles(userSelection);
        //alert(JSON.stringify(userStyles));
        /*let userStyles = {
            12:{ "2":{'border-style':'solid', 'border-color':'green', 'border-width':'2px'}},
            4:{ 2:{'border-style':'solid', 'border-color':'coral','border-width':'2px'}},
            15:{ 7:{'border-style':'solid', 'border-color':'gold','border-width':'2px'}}
        };*/
    }

    async componentDidMount(){


        let username="";
        try{
            username= (await this.props.auth.getUser())["email"];


            //alert(this.props.match.params.sheetId);
            

                openSheet(username, this.props.match.params.sheetId);

        }catch(err){

        }
        
    }
    globalHandleCellStyleChange=(data)=>{
        let value = data.style;
        if(data.col!==undefined && data.row!==undefined){
            this.setState((previousState) => {
                //console.log(i+" "+j+" "+value);
            return update(previousState, {
                gridStyles:
                { 
                    [data.row]: {
                        [data.col]:{$set:value}
                        }
                    }
                }
            )
        }
            );

            //provera da li je dozvoljena promena (poziv servera) 
        }
    }

    globalHandleCellValueChange=(data)=>{
        let value = data.value;
        if(data.col!==undefined && data.row!==undefined){
            this.setState((previousState) => {
                //console.log(i+" "+j+" "+value);
            return update(previousState, {
                grid:
                { 
                    [data.row]: {
                        [data.col]:{$set:[value]}
                        }
                    }
                }
            )
        }
            );

            //provera da li je dozvoljena promena (poziv servera) 
        }
    }

    handleCellValueChange= (i,j,event)=>{
        
        let value = event.target.value;
        if(i!==undefined && j!==undefined){
            this.setState((previousState) => {
                //console.log(i+" "+j+" "+value);
            return update(previousState, {
                grid:
                { 
                    [i]: {
                        [j]:{$set:[value]}
                        }
                    }
                }
            )
        }
            );

            //provera da li je dozvoljena promena (poziv servera) 
        }
        let data={
            "col":j,
            "row":i,
            "value":value
        };
        cellValueChange(data);
    }
    

    handleFocusChange= (i,j,event)=>{
        let key = event.target.id;
        this.setState({
                        userRowCol:{
                            row:i,
                            col:j
                        }
        });
        let message={
            "col":j,
            "row":i
        };
        selectCellUsers(message)
        //alert(JSON.stringify(this.state, null, 4));
    }
    handleFontChange= (font)=>{
        let fontV = font.value;
        let i=this.state.userRowCol.row;
        let j= this.state.userRowCol.col;
        if(i!==undefined && j!==undefined){
            this.setState((previousState) => {
            let newStyle = update(previousState, {
                gridStyles:
                { 
                    [i]: {
                        [j]:{"font-family": {$set:font["value"]}
                        }
                    }
                }
            });
            let dataStyle=newStyle["gridStyles"][i][j];
            let data={
                "row":i,
                "col":j,
                "style":dataStyle
            };

            cellStyleChange(data);
            return newStyle;
        }
            );

            //provera da li je dozvoljena promena (poziv servera) 
        }
    }
    handleColorChange= (color)=>{
        let cl = color.hex;
        this.setState({"colorPickerSelection":cl});
        let i=this.state.userRowCol.row;
        let j= this.state.userRowCol.col;
        if(i!==undefined && j!==undefined){
            this.setState((previousState) => {
            let newStyle = update(previousState, {
                gridStyles:
                { 
                    [i]: {
                        [j]:{"background-color": {$set:color.hex}
                        }
                    }
                }
            });
            let dataStyle=newStyle["gridStyles"][i][j];
            let data={
                "row":i,
                "col":j,
                "style":dataStyle
            };
            cellStyleChange(data);
            return newStyle;
        }
            );

            //provera da li je dozvoljena promena (poziv servera) 
        }

    }

    toggleStateValue (key){
        this.setState(prevState => ({
            [key]: !prevState[key]
          }));
    }
    

    rowsArrayIndex = indexArray(40);
    documentationVisibility=false;

    render() {
        let functionDocumentation="";
        if(this.state.documentationVisibility){
            functionDocumentation=<div className="row stylePanel">
            <div className="col-lg-3 col-lg-3 col-xl-3 functionsPanelLabel">
            Functions documentation ready
          </div>
          <div className="col-lg-3 col-lg-3 col-xl-3 functionsPanelLabel">
            Functions documentation ready
          </div>
          <div className="col-lg-3 col-lg-3 col-xl-3 functionsPanelLabel">
            Functions documentation ready
          </div>
          <div className="col-lg-3 col-lg-3 col-xl-3 functionsPanelLabel">
            Functions documentation ready
          </div>
                
              
          </div>;
        }
            return         (
                <div>
                    <ReactTooltip />
            <div className="row ">
                <div className="col-lg-1 col-lg-1 col-xl-1 " >
                </div>
                <div className="col-lg-10 col-lg-10 col-xl-10 functionPanel" >
                    f: <input type="text" className="functionTextbox" name="functionBody" />
                </div>
                <div className="col-lg-1 col-lg-1 col-xl-1 " >
                </div>
            </div>
            {functionDocumentation}
            <StylePanel styleVisible={this.state.stylePanelVisible} handleColorChange={this.handleColorChange.bind(this)} handleFontChange={this.handleFontChange.bind(this)} currColor={this.state.colorPickerSelection}/>
            <div className="row">
                <div className="col-lg-1 col-lg-1 col-xl-1 gridToolbar" >
                    <div className="row centerFlex">
                            <div className="btnFunction" data-tip="Functions documentation" onClick={this.toggleStateValue.bind(this,"documentationVisibility")}></div>
                    </div>
                    <div className="row centerFlex">
                            <div className="btnPaint" data-tip="Style setting" onClick={this.toggleStateValue.bind(this,"stylePanelVisible")}></div>
                    </div>
                </div>
                <div className="col-lg-10 col-lg-10 col-xl-10 gridPanel" >
                    <table>
                        {this.rowsArrayIndex.map(index=>{
                        return <GridRow rowid={index} cellChangeHandler={this.handleCellValueChange} focusChangeHandler={this.handleFocusChange} rowValues={this.state.grid[index]}
                        rowUserStyles={this.state.userStyles[index]}  userRowCol={this.state.userRowCol} gridStyles={this.state.gridStyles}/>
                    })
                        }
                    </table>
                </div>
                <div className="col-lg-1 col-lg-1 col-xl-1 gridUsers" >
                    {                       
                        this.state.userSelection.map(el=>{
                        let usColor = el.color;
                        let currStyle = {
                            "width":"5px",
                            "background-color":usColor
                        };
                        return (
                        <div className="row gridUsersRow">
                            <div className="col-lg-5 col-lg-5 col-xl-5 gridUsersRowHeight" style={currStyle}> </div> <div className="col-lg-5 col-lg-5 col-xl-5 gridUsersRowHeight"> {el.username}</div>
                        </div>);
                    })}

                </div>
                
            </div>
            </div>)

         
    }
  });

  
