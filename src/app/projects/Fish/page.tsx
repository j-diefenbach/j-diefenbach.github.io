"use client";
import { Modal } from "@mui/material";
import { Peer } from "peerjs";
import React from 'react';
const sheet1 = "https://steamusercontent-a.akamaihd.net/ugc/12934413406950940637/6495D42FD5F553CF1CE53CCC425EEFDC0EC81C36/"
function relativeToScreen(value) {
  if (typeof window === 'undefined') {
    return value;
    }
  let screenWidth = window.innerWidth;
  if (window.innerHeight * 1.29 < window.innerWidth) {
    screenWidth = window.innerHeight * 1.29;
  }
  return value / 1000 * screenWidth;
}
function CardFromSheet({id, numCardsPerRow, numRows, cardWidth,url, style}) {
  const row = Math.floor(id / numCardsPerRow);
  const col = id % numCardsPerRow;
  function getMeta(url, callback) {
    if (typeof HTMLElement === 'undefined') {
        return;
    } else {
        console.log("Getting image meta for URL:", url);
        const img = new HTMLImageElement();
        // const img = createImageBitmap(new Blob(url));
        img.src = url;
        img.onload = function() { callback(this.width, this.height); }
    }
    
  }
  // getMeta(
  //   url,
  //   (width, height) => { alert(width + 'px ' + height + 'px') }
  // );
  const [image_width, setImageWidth] = React.useState(0);
  const [image_height, setImageHeight] = React.useState(0);
  getMeta(
    url,
    (width, height) => { setImageWidth(width); return width; }
  );
  getMeta(
    url,
    (width, height) => { setImageHeight(height); return height; }
  );

  // get dimensions of image FROM URL
  // const image_width = url.width;
  // const image_height = url.height;

  // get aspect ratio by width:height of image
  // const width = image_width / numCardsPerRow;
  // cardWidth = width;
  // const height = image_height / numRows;
  // const height = 2 * cardWidth;

  const aspect = (image_width / numCardsPerRow) / (image_height / numRows);
  const cardHeight = cardWidth / aspect;


  const img_x = -col * cardWidth;
  const img_y = -row * cardHeight;

  return <div
    style={{
      width: relativeToScreen(cardWidth),
      height: relativeToScreen(cardHeight),
      backgroundImage: `url(${url})`,
      backgroundPosition: `${relativeToScreen(img_x)}px ${relativeToScreen(img_y)}px`,
      backgroundSize: `${relativeToScreen(numCardsPerRow * cardWidth)}px ${relativeToScreen(numRows * cardHeight)}px`,
      borderRadius: relativeToScreen(15),
      ...style,
    }}
    
  >
  </div>
}

const zoneRanges = {
  "Sun": [0, 1, 2],
  "Dusk": [3],
  "Night": [4,5],
  "Top": [0],
  "Bottom": [5]
}

class Card {
  constructor(
    name, cost, zones, diveSite, points, finspan, tags, abilityType, isAllPlayers, abilityReward, rowInImage, colInImage, imageSource
  )
  {
    this.name = name;
    this.cost = cost.split(' ');
    this.zones = zones.split(' ').map(zone => {
      switch(zone) {
        case 'sun':
        case 'Sun':
          return 'Sun';
        case 'dusk':
        case 'Dusk':
          return 'Dusk';
        case 'night':
        case 'Night':
          return 'Night';
        case 'top':
        case 'Top':
          return 'Top';
        case 'bottom':
        case 'Bottom':
          return 'Bottom';
        default:
          return zone;
      }
    });
    this.diveSite = diveSite;
    this.points = parseInt(points);
    this.finspan = parseInt(finspan);
    this.tags = tags.split(' ').map(tag => tag.toLowerCase());
    this.abilityType = abilityType;
    this.isAllPlayers = isAllPlayers;
    this.abilityReward = abilityReward.split(' ');
    this.rowInImage = parseInt(rowInImage);
    this.colInImage = parseInt(colInImage);
    this.idInImage = (this.colInImage-1) + (this.rowInImage-1) * 4;
    this.imageSource = imageSource;
    this.imageCols = 4
    this.imageRows = 7
    if (this.imageSource === "https://steamusercontent-a.akamaihd.net/ugc/13586578094984520003/7F3DB5446970DA168F569274083DDA82364B1A12/")
    {
      this.imageRows = 3
    } else if (this.imageSource === "https://steamusercontent-a.akamaihd.net/ugc/15008257014968613101/00739914B4A57AA5ECABB5380B2F9873E3BD356C/")
    {
      this.imageRows = 4
    }
  }

  getCardComponent(cardWidth) {
    return <CardFromSheet
      id={this.idInImage}
      numCardsPerRow={this.imageCols}
      numRows={this.imageRows}
      cardWidth={cardWidth}
      url={this.imageSource}
      style = {{
      }}
    />
  }

  canBePlaced(row, col, fish) {
    // check either no fish or smaller fish in spot
    let fishHere = false
    if (!fish[row][col] || fish[row][col].finspan < this.finspan) {
      fishHere = true;
    }
    if (!fishHere) {
      return false;
    }

    // check zones match
    let zoneMatch = false;
    for (const zone of this.zones) {
      if (zoneRanges[zone].includes(row)) {
        zoneMatch = true;
        break;
      }
    }
    if (!zoneMatch) {
      return false;
    }

    // check dive site
    if (this.diveSite !== "") {
      if (this.diveSite === "purple" && col !== 1) {
        return false;
      } else if (this.diveSite === "blue" && col !== 0) {
        return false;
      } else if (this.diveSite === "green" && col !== 2) {
        return false;
      }
    }

    // check tuck costs and size of fish in spot
    if (this.cost.includes("tuck")) {
      if (fish[row][col] === null) {
        return false;
      } else if (fish[row][col].finspan > this.finspan) {
        return false;
      }
    }
    console.log("Checking tuck cost for", this.cost, `${"tuck" in this.cost}`);
    console.log(`Card ${this.name} can be placed at (${row}, ${col})`);
    return true;
  }
}

function TestTransitionDiv({location}) {
  const [state, setState] = React.useState({
      backgroundColor: 'red',
  })

  return <object
    style={{
      width: relativeToScreen(50),
      height: relativeToScreen(50),
      borderRadius: relativeToScreen(4),
      position: 'absolute',
      top: location.y,
      left: location.x,
      transition: 'left 0.3s, top 0.3s, background-color 2s',
    }}
    data="https://navarog.github.io/finsearch/static/media/FishEgg.47c0854a65b931607a5f.svg"
    type="image/svg+xml"
  />
}


function getDataFromGoogleSheet(apiKey, spreadsheetId, range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.values;
    })
    .catch(error => {
      console.error('Error fetching data from Google Sheets:', error);
    });
}

function writeDataToGoogleSheet(apiKey, spreadsheetId, range, values) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW&key=${apiKey}:append`;
  const body = {
    values: values,
  };
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error writing data to Google Sheets:', error);
    });
}

function BoardSlot(position, fish, eggs, young, schools, tuckedFish, selectedFish, deckFish, fishInhand, selections, queue, functions) {
  const [hovered, setHovered] = React.useState(false);

  function slotMeetsRestriction(queueItem) {
    // check if slot meets restrictions for queue item
    if (!queueItem.restriction) {
      return true;
    }
    switch (queueItem.restriction) {
      case "sun":
      case "Sun":
        return [0,1,2].includes(position.x);
      case "dusk":
      case "Dusk":
        return position.x === 3;
      case "night":
      case "Night":
        return [4,5].includes(position.x);
      case "top":
        return position.x === 0;
      case "bottom":
        return position.x === 5;
      case "purple":
        return position.y === 1;
      case "blue":
        return position.y === 0;
      case "green":
        return position.y === 2;
      case "small":
        return fish[position.x][position.y] === null || fish[position.x][position.y].finspan < 50;
      case "medium":
        return fish[position.x][position.y] === null || fish[position.x][position.y].finspan >= 50 
        && fish[position.x][position.y].finspan < 150;
      case "large":
        return fish[position.x][position.y] === null || fish[position.x][position.y].finspan >= 150;
      case "pred":
        return fish[position.x][position.y] !== null && fish[position.x][position.y].tags.includes('pred');
      default:
        return true;
    }
  }

  function canMoveHere() {
    if (queue.length > 0 && queue[0].type === "move") {
      if (selections.length === 1) {
        // check for selection not matching row/col
        if (selections[0].position.x === undefined ||selections[0].position.x !== position.x && selections[0].position.y !== position.y) {
          return false;
        }
        // check if young, then can move
        if (selections[0].type === 'young') {
          return true;
        } else if (selections[0].type === 'school') {
          // TODO check no schools between selection and here
          for (let i = Math.min(selections[0].position.x, position.x); i <= Math.max(selections[0].position.x, position.x); i++) {
            for (let j = Math.min(selections[0].position.y, position.y); j <= Math.max(selections[0].position.y, position.y); j++) {
              console.log(`Checking school at (${i}, ${j}):`, schools[i][j]);
              if (i === selections[0].position.x && j === selections[0].position.y) {
                continue;
              }
              if (schools[i][j] > 0 || (i !== selections[0].position.x && j !== selections[0].position.y)) {
                return false;
              }
            }
          return true;
          }
        }
      }
    }
  return false;

  }

  const hoverPreviewIcon = () => {
    if (hovered && queue.length > 0) {
      if (!slotMeetsRestriction(queue[0])) {
        return null;
      }
      switch(queue[0].type) {
        case "young":
          return <YoungFish width={relativeToScreen(30)} height={relativeToScreen(30)}/>;
        case "egg":
          if (eggs[position.x][position.y] !== 0 || fish[position.x][position.y] === null) {
            return null;
          }
          return <Egg width={relativeToScreen(30)} height={relativeToScreen(30)}/>;
        case "school":
          if (schools[position.x][position.y] === 1) {
            return null;
          }
          return <SchoolFish width={relativeToScreen(30)} height={relativeToScreen(30)}/>;
        case "move":
          console.log("Hover preview for move with selections:", selections);
          if (selections.length === 1) {
            // check for selection not matching row/col
            if (selections[0].position.x !== position.x && selections[0].position.y !== position.y) {
              return null;
            }
            if (selections[0].type === 'young') {
              return <YoungFish width={relativeToScreen(30)} height={relativeToScreen(30)}/>;
            } else if (selections[0].type === 'school') {
              // TODO check no schools between selection and here
              for (let i = Math.min(selections[0].position.x, position.x); i <= Math.max(selections[0].position.x, position.x); i++) {
                for (let j = Math.min(selections[0].position.y, position.y); j <= Math.max(selections[0].position.y, position.y); j++) {
                  console.log(`Checking school at (${i}, ${j}):`, schools[i][j]);
                  if (i === selections[0].position.x && j === selections[0].position.y) {
                    continue;
                  }
                  if (schools[i][j] > 0 || (i !== selections[0].position.x && j !== selections[0].position.y)) {
                    return null;
                  }
                }
              }
              return <SchoolFish width={relativeToScreen(30)} height={relativeToScreen(30)}/>;
            }
          }
          return null
        default:
          return null;
        }
      }
      return null
  }

  function canPlaceFishHere(ignoreRestrictions=false) {

    if (ignoreRestrictions === false && queue.length > 0 && !slotMeetsRestriction(queue[0])) {
      return null;
    }
    if (selectedFish && selectedFish.canBePlaced && 
          (queue.length > 0 && 
        queue[0].type === "fishfromhand" || queue.length === 0) &&
          (ignoreRestrictions || selectedFish.canBePlaced(position.x, position.y, fish))) {
      return true;
    }
  }

  const [eggSelected, setEggSelected] = React.useState(false);
  const [youngSelected, setYoungSelected] = React.useState(0);
  const [schoolSelected, setSchoolSelected] = React.useState(false);

  React.useEffect(() => {
    // check if egg selected
    setEggSelected(selections.filter(sel => sel.type === 'egg' && sel.position.x === position.x && sel.position.y === position.y).length > 0);
    setYoungSelected(selections.filter(sel => sel.type === 'young' && sel.position.x === position.x && sel.position.y === position.y).length);
    setSchoolSelected(selections.filter(sel => sel.type === 'school' && sel.position.x === position.x && sel.position.y === position.y).length > 0);
  }, [selections]);

  function updateLocalSelections() {
    setEggSelected(selections.filter(sel => sel.type === 'egg' && sel.position.x === position.x && sel.position.y === position.y).length > 0);
    setYoungSelected(selections.filter(sel => sel.type === 'young' && sel.position.x === position.x && sel.position.y === position.y).length);
    setSchoolSelected(selections.filter(sel => sel.type === 'school' && sel.position.x === position.x && sel.position.y === position.y).length > 0);
  }

  React.useEffect(() => {
    // console.log(`BoardSlot at (${position.x}, ${position.y}) hovered:`, hovered);
    setHovered(false);
  }, [fish]);
  return <div
  style = {{
    position: 'relative',
  }}
  
    onClick = {
      (e) => {
        console.log(`Clicked on board slot at (${position.x}, ${position.y})`);
        // if queue has "young", add young to this slot
        if (queue.length > 0 && queue[0].type === "young") {
          young[position.x][position.y] += 1;
          queue.shift();
        } else if (queue.length > 0 && queue[0].type === "egg") {
          if (eggs[position.x][position.y] !== 0 || fish[position.x][position.y] === null) {
            return;
          }
          // TODO max one egg
          eggs[position.x][position.y] += 1;
          queue.shift();
        } else if (queue.length > 0 && queue[0].type === "school") {
          // TODO max one school
          schools[position.x][position.y] += 1;
          queue.shift();
        } else if (queue.length > 0 && queue[0].type === "move") {
          if (canMoveHere()) {
            console.log(`Moving selection to (${position.x}, ${position.y})`);
            const selection = selections[0];
            if (selection.type === 'young') {
              young[selection.position.x][selection.position.y] -= 1;
              young[position.x][position.y] += 1;
            } else if (selection.type === 'school') {
              schools[selection.position.x][selection.position.y] = 0
              schools[position.x][position.y] = 1
            }
            // remove first item from queue
            queue.shift();
            // clear selections
            selections.splice(0, selections.length);
          } else {
            e.stopPropagation();
          }
        }
      }
    }
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
    <div
      style={{
        width: relativeToScreen(200),
        height: relativeToScreen(130),
        borderRadius: relativeToScreen(15),
        border: `${relativeToScreen(2)}px dashed gray`,
        boxShadow: (() => {
          if (queue.length === 0) return 'none';
          if (queue[0].sourceCol !== position.y || queue[0].sourceRow !== position.x) return 'none';
          switch(queue[0].type) {
            case "cost":
              // return queue.length > 0 && queue[0].sourceCol === position.y && queue[0].sourceRow === position.x ?  : 'none'
              return '0 0 10px 5px red'
            default:
              if (queue[0].sourceAbility === "when played") {
                return '0 0 10px 5px blue'
              }
              // assume "is activated"
              return '0 0 10px 5px orange'
              return 'none';
          }

        })(),
        
        
        
      }}
      onClick={() => {
        console.log(`Clicked on empty slot at (${position.x}, ${position.y})`);
        // if selectedFish is not null, place it here
        console.log(selectedFish)
        
        if (canPlaceFishHere()) {
          const x = position.x;
          const y = position.y;
          // move current fish to tuckedFish if needed
          if (fish[x][y] !== null) {
            tuckedFish[x][y].push(fish[x][y]);
          }
          fish[x][y] = selectedFish;
          // remove selectedFish from deckFish
          const index = fishInhand.indexOf(selectedFish);
          if (index > -1) {
            fishInhand.splice(index, 1);
          }

          
          // clear "fishfromhand" queue items
          if (queue.length > 0 && queue[0].type === "fishfromhand") {
            queue.shift();
          }

          // add cost to start of queue
          // queue = [["cost",...selectedFish.cost], ...queue];
          queue.unshift({type: "cost", cost: selectedFish.cost, sourceRow: x, sourceCol: y});
          console.log(`Placing fish ${selectedFish.name} at (${x}, ${y}) with cost:`, selectedFish.cost);
          console.log(queue)
          const log = functions.getActionLog();
          log.push(`Placed fish ${selectedFish.name} at (${position.x}, ${position.y})`);
          functions.setActionLog(log);
        
          

          // add onPlaced effects here
          if (selectedFish.abilityType === "when played") {
            console.log(`Triggering 'when placed' ability for ${selectedFish.name}`);
            if (selectedFish.abilityReward.includes("in") || selectedFish.abilityReward.includes("on")) {
              // weird restriction stuff
              if (selectedFish.abilityReward[0] === "fish" && selectedFish.abilityReward[1] === "in") {
                // third word restricts location either zone (top, sun, dusk, night, bottom) or dive site (purple, blue, green)
                const locationRestriction = selectedFish.abilityReward[2];
                queue.push({type: "fishfromhand", restriction: locationRestriction, sourceRow: x, sourceCol: y, sourceAbility: "when played"});
              } else if (selectedFish.abilityReward[1] === "on") {
                // check if 3rd word is every
                const every = selectedFish.abilityReward[2] === "every";
                let restriction = null;
                // TODO restriction can also be fish size
                // TODO can also be tag
                if (every) {
                  restriction = selectedFish.abilityReward[3];
                } else {
                  restriction = selectedFish.abilityReward[2];
                }
                queue.push({type: selectedFish.abilityReward[0], restriction: restriction, every: every, sourceRow: x, sourceCol: y, sourceAbility: "when played"});
              }
            } else {
              for (const reward of selectedFish.abilityReward) {
                // rewards must go after cost is payed
                queue.push({type: reward, sourceRow: x, sourceCol: y, sourceAbility: "when played"});
              }
            }
          }

          // TODO use setSelectedFish from App to clear selection
          selectedFish = undefined;
          functions.setSelectedFish(undefined);
          functions.setQueue(queue);


          
        }
        
      }}
      
    >
    {/* Additional cards for tucked cards */}
    {tuckedFish[position.x][position.y].map((tuckedCard, index) => {
      return <div
        key={index}
        style={{
          position: 'absolute',
          bottom: relativeToScreen(-5 - (tuckedFish[position.x][position.y].length - 1 - index) * 3),
          right: relativeToScreen(0),
          border: `${relativeToScreen(1)}px solid black`,
          borderRadius: relativeToScreen(15),
        }}
      >
        {tuckedCard.getCardComponent(200)}
      </div>
    })}
    <div
      style = {{
        position: 'absolute',
        border: `${relativeToScreen(1)}px solid black`,
        borderRadius: relativeToScreen(15),
        borderBottom: `${relativeToScreen(2)}px solid black`,
      }}
    >
    {fish[position.x][position.y] && fish[position.x][position.y].getCardComponent(200)}
    </div>
    <div style={{
      filter: hovered ? (canPlaceFishHere() ? 
          'brightness(70%)' : 'sepia(50%) brightness(30%)')
        : 'none',
        marginTop: fish[position.x][position.y] ? relativeToScreen(-150) : 0,
        borderRadius: relativeToScreen(15),
        boxShadow:  hovered && canPlaceFishHere() ? '4px 4px 10px 2px black' : 'none',
      }}
    >
      {
        hovered ? canPlaceFishHere(true) &&
        selectedFish.getCardComponent(200)
        : null}
        </div>
    </div>

        {Array.from({length: young[position.x][position.y]}, (_, i) => (
            <div
              style={{
                position: 'absolute',
                bottom: relativeToScreen(i*10),
                right: relativeToScreen(50),
                width: relativeToScreen(30),
                height: relativeToScreen(30),
                backgroundColor: '#E0E440',
                border: `${relativeToScreen(2)}px solid black`,
                borderRadius: relativeToScreen(10),
                // selection highlight
                boxShadow: youngSelected ?
                  `0 0 ${relativeToScreen(5)}px ${relativeToScreen(5)}px yellow` : '2px 2px 5px rgba(0,0,0,0.3)',
                borderBottomWidth: relativeToScreen(4),
              }}
              onClick={(e)=> {
                // if movement then can only select one young
                e.stopPropagation();
                if (queue.length > 0 && queue[0].type === "move") {
                  // remove everything from selections and add this young
                  selections.splice(0, selections.length);
                  selections.push({type: 'young', position: {x: position.x, y: position.y}});
                  functions.setSelections(selections);
                  return;
                }
                  
                // add young to selection (for cost or movement)
                // cycle from 0-number of young on card
                let numSelectedHere = selections.filter(sel => sel.type === 'young' && sel.position.x === position.x && sel.position.y === position.y).length;
                if (numSelectedHere < young[position.x][position.y]) {
                  selections.push({type: 'young', position: {x: position.x, y: position.y}});
                  functions.setSelections(selections);
                } else {
                  // remove all selected here
                  for (let j = 0; j < young[position.x][position.y]; j++) {
                  // selections = selections.filter(sel => !(sel.type === 'young' && sel.position.x === position.x && sel.position.y === position.y));
                    let selectedindex = selections.findIndex(sel => sel.type === 'young' && sel.position.x === position.x && sel.position.y === position.y);
                    if (selectedindex > -1) {
                      selections.splice(selectedindex, 1);
                    }
                  }
                }
                updateLocalSelections();
              }}
              >
                <YoungFish width={relativeToScreen(20)} height={relativeToScreen(23)} />
            </div> 
        ))}
        {/* {hovered && queue.length > 0 && queue[0].type === "young" ?
          <div
            style={{
              position: 'absolute',
              bottom: relativeToScreen(5),
              left: relativeToScreen(5),
              width: relativeToScreen(30),
              height: relativeToScreen(30),
              backgroundColor: '#E0E440',
              border: `${relativeToScreen(2)}px solid black`,
              borderRadius: relativeToScreen(10),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <YoungFish width={relativeToScreen(20)} height={relativeToScreen(20)}/>
          </div>  
          : null
        } */}
        {hovered && <div
          style={{
            position: 'absolute',
            top: relativeToScreen(5),
            right: relativeToScreen(5),
            width: relativeToScreen(30),
            height: relativeToScreen(30),
            filter: 'opacity(50%)',
          }}
        >
          {hoverPreviewIcon()}
        </div>  
      }
    {Array.from({length: eggs[position.x][position.y]}, (_, i) => (
        <div
      style={{  
        position: 'absolute',
        bottom: relativeToScreen(0),
        left: relativeToScreen(30),
        width: relativeToScreen(30),
        height: relativeToScreen(30),
        backgroundColor: '#D55943',
        border: `${relativeToScreen(2)}px solid black`,
        borderRadius: relativeToScreen(10),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // boxShadow: selections.filter(sel => sel.type === 'egg' && sel.position.x === position.x && sel.position.y === position.y).length > i ?
        //   `0 0 ${relativeToScreen(5)}px ${relativeToScreen(5)}px yellow` : 'none',
        boxShadow: eggSelected ?
          `0 0 ${relativeToScreen(5)}px ${relativeToScreen(5)}px yellow` : 'none',
        borderBottomWidth: relativeToScreen(4),
      }}
      onClick={(e) => {
        // if queue is hatch then turn into young
        if (queue.length > 0 && queue[0].type === "hatch") {
            e.stopPropagation();
          eggs[position.x][position.y] = 0;
          young[position.x][position.y] += 1;
          queue.shift();
          const log = functions.getActionLog();
          log.push(`Hatched egg at (${position.x}, ${position.y})`);
          functions.setActionLog(log);
          return;
        }

        // add egg to selection (for cost)
        let numSelectedHere = selections.filter(sel => sel.type === 'egg' && sel.position.x === position.x && sel.position.y === position.y).length;
        if (numSelectedHere < eggs[position.x][position.y]) {
          selections.push({type: 'egg', position: {x: position.x, y: position.y}});
          functions.setSelections(selections);
          updateLocalSelections();
        } else {
          // remove all selected here (only 1)
          selections.splice(selections.findIndex(sel => sel.type === 'egg' && sel.position.x === position.x && sel.position.y === position.y), 1);
          functions.setSelections(selections);
          updateLocalSelections();
        }
      }}
      >
      <Egg width={25} height={25} />
      </div>
      ))}
      {(schools[position.x][position.y] === 1 || (young[position.x][position.y] > 2 && schools[position.x][position.y] == 0) ) &&
        <div
      style={{  
        position: 'absolute',
        bottom: relativeToScreen(0),
        left: relativeToScreen(70),
        width: relativeToScreen(40),
        height: relativeToScreen(30),
        backgroundColor: '#AE003F',
        border: `${relativeToScreen(2)}px solid black`,
        borderRadius: relativeToScreen(10),
        filter: schools[position.x][position.y] === 1 ? 'brightness(100%)' : 'opacity(20%)',
        // boxShadow: selections.filter(sel => sel.type === 'school' && sel.position.x === position.x && sel.position.y === position.y).length === 1 ?
        //           `0 0 ${relativeToScreen(5)}px ${relativeToScreen(5)}px yellow` : '2px 2px 5px rgba(0,0,0,0.3)',
        boxShadow: schoolSelected ?
                  `0 0 ${relativeToScreen(5)}px ${relativeToScreen(5)}px yellow` : '2px 2px 5px rgba(0,0,0,0.3)',
        borderBottomWidth: relativeToScreen(4),
      }}
      onClick={(e) => {
            e.stopPropagation();

          if (schools[position.x][position.y] === 0) {
            // convert fish to school
            console.log(`Converting young to school at (${position.x}, ${position.y})`);
            young[position.x][position.y] -= 3
            schools[position.x][position.y] = 1
            const log = functions.getActionLog();
            log.push(`Converted 3 young fish into a school at (${position.x}, ${position.y})`);
            functions.setActionLog(log);
            return
          }
          if (queue.length > 0 && queue[0].type === "move") {
              // remove everything from selections and add this young
              selections.splice(0, selections.length);
              selections.push({type: 'school', position: {x: position.x, y: position.y}});
              functions.setSelections(selections);
              updateLocalSelections();  

              return;
          }
          // add school to selection (for cost)
          let numSelectedHere = selections.filter(sel => sel.type === 'school' && sel.position.x === position.x && sel.position.y === position.y).length;
          if (numSelectedHere < schools[position.x][position.y]) {
            selections.push({type: 'school', position: {x: position.x, y: position.y}});
            functions.setSelections(selections);
          } else {
            // remove all selected here (only 1)
            selections.splice(selections.findIndex(sel => sel.type === 'school' && sel.position.x === position.x && sel.position.y === position.y), 1);
            functions.setSelections(selections);
          }
          updateLocalSelections();

        }}

      >
       <SchoolFish/>
      </div>
      }
  </div>
}

function AnimationDrawCard(animationState, setAnimationState) {
  // starts at the deck position and moves to hand position
  const [drawing, setDrawing] = React.useState(false);
  let i = 5
  React.useEffect(() => {
    console.log('AnimationDrawCard: animationState changed to', animationState);
    if (animationState === 'drawing') {
      console.log('AnimationDrawCard: drawing animation started');
      setTimeout(() => {
        setAnimationState('idle');
      }, 500);
    }
  }, [animationState]);
  React.useEffect(() => {
    if (drawing) {
      setTimeout(() => {
        setDrawing(false);
      }, 500);
    }
  }, [drawing]);
  return  <div
              key={i}
              style={{
                position: 'absolute',
                top: relativeToScreen(5 + i * 2),
                left: relativeToScreen(5 + i * 2),
                // width: relativeToScreen(100),
                // height: relativeToScreen(150),
                backgroundColor: 'white',
                borderRadius: relativeToScreen(15),
                boxShadow: `0 ${relativeToScreen(2)}px ${relativeToScreen(4)}px rgba(0, 0, 0, 0.3)`,
                border: `${relativeToScreen(1)}px solid black`,
                transform: !drawing? 'skewY(-5deg)': 'skewY(5deg)',
                zIndex: 2000,
                transition: 'all 0.5s ease-in-out',
                top: drawing ? relativeToScreen(600) : relativeToScreen(5 + i * 2),
                left: drawing ? relativeToScreen(800) : relativeToScreen(5 + i * 2),
              }}
              onClick={
                () => setDrawing(true)
              }
            >
            <CardFromSheet
          id={1}
          numCardsPerRow={4}
          numRows={7}
          cardWidth={200}
          url={sheet1}
          />
              </div>
}

function Egg({width=30, height=30, onClick}) {
  return <object
    data="https://navarog.github.io/finsearch/static/media/FishEgg.47c0854a65b931607a5f.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height),
      pointerEvents: 'none'
    }}
    onClick={onClick}
  />
}
function YoungFish({width=30, height=30, onClick}) {
  return <object
    data="https://navarog.github.io/finsearch/static/media/YoungFish.7f06744193cdc4226005.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height),
      pointerEvents: 'none'

    }}
    onClick={onClick}
  />
}
function SchoolFish({width=30, height=30, onClick}) {
  return <object
    data="https://navarog.github.io/finsearch/static/media/SchoolFish.825825df01f2bbbd9fc6.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height),
      pointerEvents: 'none'

    }}
    onClick={onClick}
  />
}

function DrawCard({width=30, height=30}) {
  return <object
      data="https://navarog.github.io/finsearch/static/media/DrawCard.f8797f97d67a54536956.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height)}}
  />
}
function Recycle({width=30, height=30}) {
  return <object
    data="https://navarog.github.io/finsearch/static/media/Discard.be9f1d498b060aed10aa.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height)}}
  />
}

function FishFromHand({width=30, height=30}) {
  return <object
    data="https://navarog.github.io/finsearch/static/media/FishFromHand.3555bcabadb9dc5316d5c371d35491c3.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height)}}
    />
}

function HatchFish({width=30, height=30}) {
  return <object
                data = "https://navarog.github.io/finsearch/static/media/FishHatch.58ff38c722190a38c540.svg"
                type="image/svg+xml"
                style={{width: relativeToScreen(30), height: relativeToScreen(30)}}
              />
}

function Move({width=30, height=30}) {
  return <object
    data="https://navarog.github.io/finsearch/static/media/SchoolFeederMove.be97b1352a4dcaf90302.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height)}}
  />
}

function SunIcon({width=30, height=30}) {
  return <object
    data="https://navarog.github.io/finsearch/static/media/Sun.0d0fbe355de66b5ee060.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height)}}
  />
}

function DuskIcon({width=30, height=30}) {
  return <object
    data="https://navarog.github.io/finsearch/static/media/Dusk.6bc87cf6af5e002d9080.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height)}}
  />
}

function NightIcon({width=30, height=30}) {
  return <object
    data="https://navarog.github.io/finsearch/static/media/Night.9a47430fb3b54cd0aba7.svg"
    type="image/svg+xml"
    style={{width: relativeToScreen(width), height: relativeToScreen(height)}}
  />
}

const roundCardSheet = "https://steamusercontent-a.akamaihd.net/ugc/9677629350803164091/BC2E86AAFA36E672773B6CF40FADBED13567014B/"


// get peername from devicename

export default function App() {
  const [eggLocation, setEggLocation] = React.useState({x: relativeToScreen(100), y: relativeToScreen(100)});


  const testApiKey = "AIzaSyBaMrc5zsAi0pfTRoBT06erYjBkywRxjIQ"

  // get user input for peer name
  const [thisPeerName, setThisPeerName] = React.useState("");
  const [otherPeerName, setOtherPeerName] = React.useState("");


  const [roundBonuses, setRoundBonuses] = React.useState([]);

  const [sheetData, setSheetData] = React.useState([]);
  
  // writeDataToGoogleSheet(
  //   testApiKey,
  //   "1-SLD7kH7SpiPfESRit_OIL475V92BaGWsJGQcgdXmFo",
  //   "Sheet2!B1",
  //   [["Last Updated", new Date().toLocaleString()]]
  // )

  // turn sheet into array of objects with keys from first row

  const [fishInhand, setFishInHand] = React.useState([]);
  const [discardedFish, setDiscardedFish] = React.useState([]);
  const [deckFish, setDeckFish] = React.useState([]);
  const [fishData, setFishData] = React.useState([]);

  const [selectedFish, setSelectedFish] = React.useState(null);
  const [selectMode, setSelectMode] = React.useState(null);
  // select mode can be 'playfish', 'pay fish' 'pay eggs' 'pay young' 'pay schools'
  // 'move'
  const [selections, setSelections] = React.useState([]);
  const [queue, setQueue] = React.useState([]); // queue of rewards / costs / actions to resolve

  // game states stored to restore with undo actions
  const [gameStates, setGameStates] = React.useState([]);
  const [uses, setUses] = React.useState({
    drawCard: 0,
    blueSite: 1,
    purpleSite: 2,
    greenSite: 3,
  });

  
  
  function saveGameState() {
    const state = JSON.parse(gameStateToString());
    console.log('Saving game state:', state);
    setGameStates([...gameStates, state]);
    // save to google doc
    writeDataToGoogleSheet(
      testApiKey,
      // "1-SLD7kH7SpiPfESRit_OIL475V92BaGWsJGQcgdXmFo",
    // "1-SLD7kH7SpiPfESRit_OIL475V92BaGWsJGQcgdXmFo",
    "1-SLD7kH7SpiPfESRit_OIL475V92BaGWsJGQcgdXmFo",
      "Sheet2!B1:B2",
      [['test']]
    )
  }

  function gameStateToString() {
    const state = {
      fishInhand: [...fishInhand],
      discardedFish: [...discardedFish],
      deckFish: [...deckFish],
      fish: fish.map(row => row.map(col => col ? col.name : null)),
      tuckedFish: tuckedFish.map(row => row.map(col => [...col])),
      eggs: eggs.map(row => [...row]),
      young: young.map(row => [...row]),
      schools: schools.map(row => [...row]),
      queue: [...queue],
    };
    return JSON.stringify(state);
  }

  function restoreGameState() {
    if (gameStates.length > 0) {
      let prevState = gameStates[gameStates.length - 1];
      // copy prevState

      // if current state is the same as prevState go back one more
      const currentStateString = gameStateToString();
      const prevStateString = JSON.stringify(prevState);
      if (currentStateString === prevStateString && gameStates.length > 1) {
        console.log('Current state is the same as previous state, going back one more');
        const prevPrevState = gameStates[gameStates.length - 2];
        // prevState = JSON.parse(JSON.stringify(prevPrevState));
        prevState = prevPrevState;
      }
      const copy = JSON.parse(JSON.stringify(prevState));
      prevState = copy;

      setFishInHand(prevState.fishInhand.map(fish => getFishByName(fish.name)));
      setDiscardedFish(prevState.discardedFish.map(fish => getFishByName(fish.name)));
      setDeckFish(prevState.deckFish);
      // map fish to corresponding objects from fishData
      const mappedFish = prevState.fish.map(row => row.map(colName => {
        console.log('Mapping fish name to object:', colName);
        if (colName === null) return null;
        console.log('mapping fish name to object:', fishData, getFishByName(colName));
        return getFishByName(colName);
      }));
      console.log('mappedFish:', mappedFish);
      setFish(mappedFish);
      // setFish(prevState.fish);
      setTuckedFish(prevState.tuckedFish.map(row => row.map(col => col.map(fish => getFishByName(fish.name)))));
      setEggs(prevState.eggs);
      setYoung(prevState.young);
      setSchools(prevState.schools);
      setGameStates(gameStates.slice(0, gameStates.length - 1));
      setQueue(prevState.queue);
      console.log('Restored game state:', prevState);
    }
  }

  function getFishByName(name) {
    if (!fishData || fishData.length === 0) return null;
    if (name === "Forage Fish") {
      return new Card(
      "Forage Fish",
      "",
      "sun dusk night",
      "",
      "0",
      "1",
      "forage",
      "",
      false,
      "",
      1, 2,
      sheet1
    )
    }
    return fishData.find(fish => fish.name === name);
  }

  const [drawingCardAnim, setDrawingCardAnim] = React.useState(false);
  const [eggs, setEggs] = React.useState(Array.from({length: 6}, () => new Array(3).fill(0)));
  const [young, setYoung] = React.useState(Array.from({length: 6}, () => new Array(3).fill(0)));
  const [schools, setSchools] = React.useState(Array.from({length: 6}, () => new Array(3).fill(0)));
  const [fish, setFish] = React.useState(Array.from({length: 6}, () => new Array(3).fill(null)));
  const [tuckedFish, setTuckedFish] = React.useState(Array.from({length: 6}, () => Array.from({length: 3}, () => Array.from({length: 0}))));
  const [actionLog, setActionLog] = React.useState([]);
  React.useEffect(() => {
    console.log('Selected Fish changed:', selectedFish);
    setSelectedFish(selectedFish);
  }, [selectedFish]);
  React.useEffect(() => {
    console.log('Deck Fish changed:', deckFish);
    setDeckFish(deckFish);
  }, [deckFish]);
  React.useEffect(() => {
    console.log('Fish in Hand changed:', fishInhand);
    setFishInHand(fishInhand);
  }, [fishInhand]);
  React.useEffect(() => {
    console.log('Fish on Board changed:', fish);
    setFish(fish);
  })
  React.useEffect(() => {
    console.log('Queue changed:', queue);
    setQueue(queue);
    // update game state
    // saveGameState();
  }, [queue]);
  React.useEffect(() => {
    setYoung(young);
  }, [young]);
  React.useEffect(() => {
    console.log('Selections changed:', selections);
    setSelections(selections);
  }, [selections]);

  function drawCard() {
    if (deckFish.length > 0) {
      // play an animation of drawing card


      const drawnCard = deckFish.pop();
      fishInhand.push(drawnCard);
      setFishInHand([...fishInhand]);
      setDeckFish([...deckFish]);
      console.log('Drew card:', drawnCard);
    }
  }

  function placeFish(fish, row, col) {
    // place fish on board at row, col

    // must pay cost first

    // show message for cost, allow selection of eggs / cards to pay cost
    // once confirm button clicked, place fish

    fish[row][col] = selectedFish;
    // remove selectedFish from deckFish
    const index = fishInhand.indexOf(selectedFish);
    if (index > -1) {
      fishInhand.splice(index, 1);
      setFishInHand([...fishInhand]);
    }
    setFish([...fish]);
    setSelectedFish(null);

  }

  const functions = {
    drawCard: drawCard,
    placeFish: placeFish,
    setQueue: () => {
      setQueue(queue);
      saveGameState();
    },
    setSelections: setSelections,
    setSelectedFish: setSelectedFish,
    setFishInHand: setFishInHand,
    setDeckFish: setDeckFish,
    setGameStates: setGameStates,
    setTuckedFish: setTuckedFish,
    setActionLog: setActionLog,
    getActionLog: () => actionLog,
  }

  const blueZoneBonuses = ['card', 'card', 'card', 'recycle']
  const purpleZoneBonuses = ['egg', 'egg', 'egg', 'egg']
  const greenZoneBonuses = ['hatch', 'hatch', 'move', 'move']
  const diveSiteBonuses = [blueZoneBonuses, purpleZoneBonuses, greenZoneBonuses]
  function activateDiveSite(col) {

    // first check queue is empty
    if (queue.length > 0) {
      console.log('Cannot activate dive site, queue is not empty');
      return;
    }
    // activate dive site, including bonuses for fish in zone

    // queue each card or reward
    const row = fish.map(r => r[col])
    // if fish in first three rows add first bonus
    let sunZoneBonus = false
    for (let i = 0; i < 3; i++) {
      if (row[i]) {
        sunZoneBonus = true;
        break;
      }
    }
    if (sunZoneBonus) {
      queue.push({type: diveSiteBonuses[col][0], source: 'dive site', sourceCol: col, sourceRow: 'sun zone'});
    }

    for (let i = 0; i < 3; i++) {
      if (row[i]) {
        const card = row[i];
        console.log('Activating dive site ability for card:', card);
        // add ability to queue
        if (card.abilityType === "if activated") {
          console.log(" ability is activated")
          card.abilityReward.map(reward => {
            console.log('Queuing reward:', reward);
            // queue.push(reward);
            queue.push({type: reward, source: 'card ability', sourceCol: col, sourceRow: i});
          });
        }
      }
    }

    if (row[3] !== null) {
      queue.push({type: diveSiteBonuses[col][1], source: 'dive site', sourceCol: col, sourceRow: 'mid zone'});
    }
    const card = row[3];
    if (card && card.abilityType === "if activated") {
      console.log(" ability is activated")
      card.abilityReward.map(reward => {
        console.log('Queuing reward:', reward);
        // queue.push(reward);
        queue.push({type: reward, source: 'card ability', sourceCol: col, sourceRow: 3});
      });
    }

    let nightZoneBonus = false
    for (let i = 4; i < 6; i++) {
      if (row[i]) {
        nightZoneBonus = true;
        break;
      }
    }
    if (nightZoneBonus) {
      queue.push({type: diveSiteBonuses[col][2], source: 'dive site', sourceCol: col, sourceRow: 'night zone'});
    }

    for (let i = 4; i < 6; i++) {
      if (row[i]) {
        const card = row[i];
        console.log('Activating dive site ability for card:', card);
        // add ability to queue
        if (card.abilityType === "if activated") {
          console.log(" ability is activated")
          card.abilityReward.map(reward => {
            console.log('Queuing reward:', reward);
            queue.push({type: reward, source: 'card ability', sourceCol: col, sourceRow: i});
          });
        }
      }
    }

    // TODO final bonus for first dive in round
    if ([uses.blueSite, uses.purpleSite, uses.greenSite][col] < 0) {
      queue.push({type: 'drawCard', source: 'dive site bonus', sourceCol: col, sourceRow: 'first dive bonus'});
    }

    const newUses = {...uses};
      if (col === 0) newUses.blueSite += 1;
      if (col === 1) newUses.purpleSite += 1;
      if (col === 2) newUses.greenSite += 1;
      setUses(newUses);

    functions.setQueue([...queue]);
  }

  function canAffordCardFromHand(card) {
      const cost = card.cost;
      console.log('Checking affordability for card:', card.name, 'with cost:', cost);
      if (!cost || cost.length === 0) {
        return 'none';
      }
      const isAffordable = cost.every(costItem => {
        if (costItem === "tuck") {
          return true;
        }
        const numAvailable = (() => {
          switch(costItem) {
            case "young":
              return young.reduce((sum, row) => sum + row.reduce((rSum, val) => rSum + val, 0), 0);
            case "egg":
              return eggs.reduce((sum, row) => sum + row.reduce((rSum, val) => rSum + val, 0), 0);
            case "school":
              return schools.reduce((sum, row) => sum + row.reduce((rSum, val) => rSum + (val > 0 ? 1 : 0), 0), 0);
            case "card":
            case "fishfromhand":
              return fishInhand.length - 1;
            default:
              return 0;
          }
        })();
        const numCost = cost.filter(c => c === costItem).length;
        return numAvailable >= numCost;
      });
      console.log('Card affordability for', card.name, ':', isAffordable);
      return isAffordable;
  }
  const starterCardNames = [
    "longfin batfish",
    "bonefish",
    "blue lanternfish",
    "porkfish",
    "saddleback butterflyfish",
    "orange roughy",
    "barreleye",
    "mandarinfish",
    "white-banded triggerfish",
    "smoothcheek lanternfish"
  ]
  // setup and starting fish
  function setupGame() {
    // create deck from sheet data
    if (sheetData.length == 0){ 
    getDataFromGoogleSheet(
    testApiKey,
    "1-SLD7kH7SpiPfESRit_OIL475V92BaGWsJGQcgdXmFo",
    "Sheet1!A1:N150"
    ).then(data => {
      console.log(data)
      const headers = data[0];
      const rows = data.slice(1);
      const objects = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index];
        });
        return obj;
      });
      setSheetData(objects);
      console.log(objects);
      for (const cardData of objects) {
        console.log('Card Data:', cardData);
        if (cardData) {
            deckFish.push(new Card(
              cardData.Name,
              cardData.Cost,
              cardData.Zones,
              cardData["Dive Site"],
              cardData.Points,
              cardData.Finspan,
              cardData.Tags,
              cardData.AbilityType,
              cardData.IsAllPlayers === 'TRUE',
              cardData.abilityReward,
              cardData.rowInImage,
              cardData.ColInImage,
              cardData.imageSource
            ))
          }
      }
      setFishData([...deckFish])
      // shuffle deck
      // deckFish.sort(() => Math.random() - 0.5);
      console.log('Deck Fish:', deckFish);
      setDeckFish(deckFish);

      if (fishInhand.length > 0) {
        return;
      }

      for (let i = 0; i < 2; i++) {
      // draw 2 starter cards
      if (deckFish.length === 0) {
        console.log('Deck is empty, cannot draw starter card');
        break;
        
      }
      const starterCardName = starterCardNames[Math.floor(Math.random() * starterCardNames.length)];
      if (fishInhand.find(card => card.name.toLowerCase() === starterCardName)) {
        i--;
        continue;
      }
      // const starterCardData = sheetData.find(card => card.Name.toLowerCase() === starterCardName);
      const starterCard = deckFish.find(card => card.name.toLowerCase() === starterCardName);
      // remove from deck
      const index = deckFish.indexOf(starterCard);
      if (index > -1) {
        deckFish.splice(index, 1);
      }
      fishInhand.push(starterCard);

      // }
      // if (starterCardData) {
      //   const starterCard = new Card(
      //     starterCardData.Name,
      //     starterCardData.Cost,
      //     starterCardData.Zones,
      //     starterCardData["Dive Site"],
      //     starterCardData.Points,
      //     starterCardData.Finspan,
      //     starterCardData.Tags,
      //     starterCardData.AbilityType,
      //     starterCardData.IsAllPlayers === 'TRUE',
      //     starterCardData.abilityReward,
      //     starterCardData.rowInImage,
      //     starterCardData.ColInImage,
      //     starterCardData.imageSource
      //   );
      //   fishInhand.push(starterCard);
      // }
      }
      setFishInHand([...fishInhand]);

      // draw 3 cards from deck
      for (let i = 0; i < 3; i++) {
        const newCard = deckFish.pop();
        fishInhand.push(newCard);
        
      }
      setFishInHand([...fishInhand]);
        setDeckFish([...deckFish]);
      });

      
  }
    
    // place starting forage fish
    fish[4][0] = new Card(
      "Forage Fish",
      "",
      "sun dusk night",
      "",
      "0",
      "1",
      "forage",
      "",
      false,
      "",
      1, 2,
      sheet1
    )
    eggs[4][0] = 1;

    fish[3][1] = new Card(
      "Forage Fish",
      "",
      "sun dusk night",
      "",
      "0",
      "1",
      "forage",
      "",
      false,
      "",
      1, 2,
      sheet1
    )
    young[2][1] = 1;
    eggs[1][2] = 1;
    fish[1][2] = new Card(
      "Forage Fish",
      "",
      "sun dusk night",
      "",
      "0",
      "1",
      "forage",
      "",
      false,
      "",
      1, 2,
      sheet1
    )
    setFish([...fish]);
    setEggs([...eggs]);
    setYoung([...young]);

    // pick 3 random round bonuses
    const round1BonusOptions = [1,2,4,11,14,16]
    const round2BonusOptions = [7,8,9,10,12,13]
    const round3BonusOptions = [3,5,6,15,17,18]

    const roundBonuses = [];
    roundBonuses.push(round1BonusOptions[Math.floor(Math.random() * round1BonusOptions.length)]-1);
    roundBonuses.push(round2BonusOptions[Math.floor(Math.random() * round2BonusOptions.length)]-1);
    roundBonuses.push(round3BonusOptions[Math.floor(Math.random() * round3BonusOptions.length)]-1);
    setRoundBonuses(roundBonuses);
    console.log('Round Bonuses:', roundBonuses);

    // TODO function for counting points at end of round

    setDeckFish([...deckFish]);
    setFishInHand([...fishInhand]);

    saveGameState();
    saveGameState();
  }
  if (gameStates.length === 0) {
    setupGame();
  }

  const [peer, setPeer] = React.useState(null);
  const [conn, setConn] = React.useState(null);
  const [peerChatLog, setPeerChatLog] = React.useState([]);
  const [chatMessage, setChatMessage] = React.useState("");
  const [settingsModalOpen, setSettingsModalOpen] = React.useState(false);

  if (peer === null) {
    const p = new Peer();
    p.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setThisPeerName(id);
    });
    setPeer(p);
  }

  React.useEffect(() => {
    if (!peer) return;
    console.log('Setting up peer connection with names:', thisPeerName, otherPeerName);
    if (otherPeerName !== "") {
      const conn = peer.connect(otherPeerName);
      setConn(conn);
      console.log('Connecting to other peer:', otherPeerName, conn);
      conn.on('open', () =>  {
        console.log('Peer connection open', conn);
        // send initial game state
        conn.on('data', (data) => {
          console.log('Received data from peer:', data);
        });
        conn.send("hello from " + thisPeerName);
        conn.send({type: 'gameState', data: gameStateToString()});
      });
      peer.on('connection', (connection) => {
        console.log('confirmed connection with peer:', connection.peer);
        connection.on('data', (data) => {
          console.log('Received data from peer:', data);
          setPeerChatLog(prevLog => [...prevLog, data]);
        });
      });
    }
  }, [otherPeerName]);

  function ItemCounters() {
    return <div
      style={{
        position: 'absolute',
        bottom: relativeToScreen(20),
        left: relativeToScreen(20),
        display: 'flex',
        flexDirection: 'row',
        gap: relativeToScreen(20),
        zIndex: 1000,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Egg width={40} height={40}/>
        <div style={{fontSize: relativeToScreen(20)}}>{eggs.flat().reduce((sum, val) => sum + val, 0)}</div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <YoungFish width={40} height={40}/>
        <div style={{fontSize: relativeToScreen(20)}}>{young.flat().reduce((sum, val) => sum + val, 0)}</div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <SchoolFish width={40} height={40}/>
        <div style={{fontSize: relativeToScreen(20)}}>{schools.flat().reduce((sum, val) => sum + (val > 0 ? 1 : 0), 0)}</div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <DrawCard width={40} height={40}/>
        <div style={{fontSize: relativeToScreen(20)}}>{fishInhand.length}</div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Recycle width={40} height={40}/>
        <div style={{fontSize: relativeToScreen(20)}}>{discardedFish.length}</div>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <FishFromHand width={40} height={40}/>
        <div style={{fontSize: relativeToScreen(20)}}>{fishInhand.length}</div>
      </div>
    </div>
  }

  // React.useEffect(() => {
  //   console.log('Setting up peer connection with names:', thisPeerName, otherPeerName);
  //   // setupPeerConnection(thisPeerName, otherPeerName, functions);
  //   const peer = new Peer("test456789")
  //   setPeer(peer);
  //   const conn = peer.connect("test123456789");
  //   setConn(conn);
  //   console.log('Peer object:', peer, conn);
  //   conn.on('open', (id) =>  {
  //     console.log('Peer connection open', id);
  //     // send initial game state
  //     conn.on('data', (data) => {
  //       console.log('Received data from peer:', data);
  //     });
  //     conn.send("hello from " + thisPeerName);
  //     conn.send({type: 'gameState', data: gameStateToString()});
  //   });
  //   peer.on('connection', (connection) => {
  //     console.log('confirmed connection with peer:', connection.peer);
  //     connection.on('data', (data) => {
  //       console.log('Received data from peer:', data);
  //       // if (data.type === 'gameState') {
  //       //   const state = JSON.parse(data.data);
  //       //   console.log('Received game state from peer:', state);
  //       //   // restore game state
  //       //   setFishInHand(state.fishInhand.map(fish => getFishByName(fish.name)));
  //       //   setDiscardedFish(state.discardedFish.map(fish => getFishByName(fish.name)));
  //       //   setDeckFish(state.deckFish);
  //       //   // map fish to corresponding objects from fishData
  //       //   const mappedFish = state.fish.map(row => row.map(colName => {
  //       //     console.log('Mapping fish name to object:', colName);
  //       //     if (colName === null) return null;
  //       //     console.log('mapping fish name to object:', fishData, getFishByName(colName));
  //       //     return getFishByName(colName);
  //       //   }));
  //       //   console.log('mappedFish:', mappedFish);
  //       //   setFish(mappedFish);
  //       //   setTuckedFish(state.tuckedFish.map(row => row.map(col => col.map(fish => getFishByName(fish.name)))));
  //       //   setEggs(state.eggs);
  //       //   setYoung(state.young);
  //       //   setSchools(state.schools);
  //       //   setQueue(state.queue);
  //       // }
  //     });
  //   });
  //   peer.on('open', (id) => {
  //     console.log('My peer ID is: ' + id);
  //     console.log('Peer object on open:', peer)
  //   });

  //   // check with reverse connection
  //   // const reversePeer = new Peer(, {debug: 2});
  //   // const reverseConn = reversePeer.connect(otherPeerName");
  //   reverseConn.on('open', () => {
  //     console.log('Reverse connection open');
  //     reverseConn.on('data', (data) => {
  //       console.log('Received data from reverse peer:', data);
  //     });
  //     reverseConn.send("hello from reverse peer");
  //     reverseConn.send({type: 'gameState', data: gameStateToString()});
  //   });
  //   reverseConn.on('connection', (connection) => {
  //     console.log('confirmed connection with reverse peer conn:', connection.peer);
  //     connection.on('data', (data) => {
  //       console.log('Received data from reverse peer conn:', data);
  //     });
  //   });
  //   reversePeer.on('connection', (connection) => {
  //     console.log('confirmed connection with reverse peer:', connection.peer);
  //     connection.on('data', (data) => {
  //       console.log('Received data from reverse peer:', data);
  //     });
  //   });
  //   reversePeer.on('open', (id) => {
  //     console.log('My reverse peer ID is: ' + id);
  //     console.log('Reverse Peer object on open:', reversePeer)
  //   });
  // }, [thisPeerName, otherPeerName]);


  return (
    <div className="App"
      
    >

        <header
            style = {{
                backgroundColor: '#282c34',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'calc(10px + 2vmin)',
                color: 'white',
            }}
            >

        {/* Round display */}
        <div
          style={{
            position: 'relative',
            top: relativeToScreen(10),
            alignSelf: 'center',
            justifySelf: 'center',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'row',
            gap: relativeToScreen(10),
          }}
        >
          {roundBonuses.map((bonus, index) => (
            <div key={index} style={{borderRadius: relativeToScreen(10)}}>
              {/* <RoundBonusIcon bonusId={bonus} width={relativeToScreen(30)} height={relativeToScreen(30)} /> */}
              <CardFromSheet
                id={bonus}
                numCardsPerRow={4}
                numRows={5}
                cardWidth={100}
                url={roundCardSheet}
              />
            </div>
          ))}
        </div>

        {/* <AnimationDrawCard animationState={animationState} setAnimationState={setAnimationState} />
        <button
         onClick={saveGameState}
        >Save</button>
        <button
          onClick={restoreGameState}
        >Undo</button>
        <button
          onClick = {
            () => {
              // draw young
              queue.push({type: "young"})
              setQueue([...queue]);
            }
          }
        >Draw Young</button>
        <button
          onClick = {
            () => {
              // draw young
              queue.push({type: "egg"})
              setQueue([...queue]);
            }
          }
        >Draw Egg</button>
        <button
          onClick = {
            () => {
              // draw young
              queue.push({type: "school"})
              setQueue([...queue]);
            }
          }
        >Draw school</button>
        <button
          onClick = {
            () => {
              queue.push({type: "drawcard"})
              setQueue([...queue]);
            }
          }
        >Draw Card</button>
        <button
          onClick = {
            () => {
              queue.push({type: "fishfromhand"})
              setQueue([...queue]);
            }
            }
          >Play Fish</button>
          <button
          onClick = {
            () => {
              queue.push({type: "move"})
              setQueue([...queue]);
            }
            }
          >Move</button> */}
          <button
            style={{
              position: 'fixed',
              top: relativeToScreen(10),
              right: relativeToScreen(10),
              zIndex: 1000,
            }}
            onClick={restoreGameState}
          >
            Undo {gameStates.length > 0 ? `(${gameStates.length})` : ''}
          </button>
          {/* Undo button (go back to prev game state) */}
          <div
            // div for menu and connection options
            style={{
              position: 'fixed',
              bottom: relativeToScreen(10),
              left: relativeToScreen(10),
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: relativeToScreen(10),
            }}
          >
          

          {/* Peer stuff */}
          <div
            onClick={() => setSettingsModalOpen(true)}
            style = {{
                fontSize: relativeToScreen(12),
                position: 'fixed',
                top: relativeToScreen(10),
                right: relativeToScreen(10),
                zIndex: 1000,
                cursor: 'pointer',
            }}
          >
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" fill="#FFFFFF"></path> </g></svg>

          </div>
          <Modal
          open = {settingsModalOpen}
            onClose={() => setSettingsModalOpen(false)}
            >
                <div
                    style = {{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: relativeToScreen(300),
                        backgroundColor: '#282c34',
                        border: '2px solid #000',
                        boxShadow: '24px',
                        padding: relativeToScreen(20),
                        color: 'white',
                    }}
                >
            <div style={{display: 'flex', flexDirection: 'column', gap: relativeToScreen(5)}}>
                {peerChatLog.map((msg, index) => (
                <div key={index} style={{border: '1px solid white', borderRadius: relativeToScreen(5), padding: relativeToScreen(5)}}>
                    <p style={{fontSize: relativeToScreen(12), padding: relativeToScreen(0), margin: relativeToScreen(0)}}>{JSON.stringify(msg).slice(0,20)+'...'}</p>
                </div>
                ))}
            </div>
            
            <div style={{display: 'block'}}>
                <p style={{fontSize: relativeToScreen(12), padding: relativeToScreen(0), margin: relativeToScreen(0)}}>Your Peer Name:</p>
                <button onClick={() => {navigator.clipboard.writeText(thisPeerName)}}>Copy</button> 
                <input
                type="text"
                placeholder="Your Peer Name"
                value={thisPeerName}
                style={{
                    color: 'gray',
                }}
                />
            </div>
            <input
                type="text"
                placeholder="Other Peer Name"
                    style={{ color: 'black' }}
                value={otherPeerName}
                onChange={(e) => setOtherPeerName(e.target.value)}
            />
            {/* <button
                style={{
                }}
                onClick={() => {
                // send game state to other peer
                console.log('Sending game state to peer');
                // const peer = new Peer(thisPeerName)
                // const conn = peer.connect(otherPeerName);
                // conn.send({type: 'gameState', data: gameStateToString()});
                conn.send("hello from " + thisPeerName);
                }}
            >
                Send Game State
            </button> */}
            <div style = {{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                {/* Chat */}
                <input
                type="text"
                placeholder="Chat Message"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                style={{
                    fontSize: relativeToScreen(12),
                }}
                />
                <button
                onClick={() => {
                    console.log('Sending chat message to peer:', chatMessage);
                    conn.send({message: chatMessage});
                    setPeerChatLog(prevLog => [...prevLog, "you: " + chatMessage]);
                    setChatMessage('');
                }}
                >
                Send
                </button>
            </div>
            </div>
          </Modal>
          </div>
          <div
            style={{
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            bottom: relativeToScreen(10),
            left: relativeToScreen(10),
            zIndex: 1000,
            }}
            >
            {queue.map((item, index) => {
              switch(queue[queue.length - 1 - index].type) {
                case "young":
                  return <YoungFish width={relativeToScreen(30)} height={relativeToScreen(30)} key={index} />
                  break;
                case "egg":
                  return <Egg width={relativeToScreen(30)} height={relativeToScreen(30)} key={index} />
                  break;
                case "school":
                  return <SchoolFish width={relativeToScreen(30)} height={relativeToScreen(30)} key={index} />
                  break;
                case "drawcard":
                case "card":
                  return <>
                  <DrawCard width={relativeToScreen(30)} height={relativeToScreen(30)} key={index} />
                  {queue[queue.length - 1 - index].restriction && <>
                  <object
                    data="https://navarog.github.io/finsearch/static/media/ArrowDown.6d19faad0ef0c8eedd9b.svg"
                    type="image/svg+xml"
                    style={{width: relativeToScreen(15), height: relativeToScreen(15),
                      marginLeft: relativeToScreen(5),
                      marginRight: relativeToScreen(5),
                    }}
                  />
                  <SunIcon width={relativeToScreen(20)} height={relativeToScreen(20)} />
                  {/* <p>{JSON.stringify(queue[queue.length - 1 - index].restriction)}</p> */}
                  </>
                  }
                  </>
                case "hatch":
                  return <HatchFish width={relativeToScreen(30)} height={relativeToScreen(30)} key={index} />
                case "move":
                  return <Move width={relativeToScreen(30)} height={relativeToScreen(30)} key={index} />
                case "recycle":
                  return <Recycle/>
                case "fishfromhand":
                  return <>
                  <FishFromHand/>
                  {queue[queue.length - 1 - index].restriction && <>
                  <object
                    data="https://navarog.github.io/finsearch/static/media/ArrowDown.6d19faad0ef0c8eedd9b.svg"
                    type="image/svg+xml"
                    style={{width: relativeToScreen(15), height: relativeToScreen(15),
                      marginLeft: relativeToScreen(5),
                      marginRight: relativeToScreen(5),
                    }}
                  />
                  <SunIcon width={relativeToScreen(20)} height={relativeToScreen(20)} />
                  {/* <p>{JSON.stringify(queue[queue.length - 1 - index].restriction)}</p> */}
                  </>}
                  </>
                case "cost":
                    const cost = queue[queue.length - 1 - index].cost;
                    const isAffordable = cost.every(costItem => {
                      if (costItem === "tuck") {
                        return true;
                      }
                      const numSelected = selections.filter(sel => sel.type === costItem).length;
                      const numCost = cost.filter(c => c === costItem).length;
                      return numSelected >= numCost;
                    });
                    return <div style = {{display: 'flex', alignItems: 'center', flexDirection: 'row'}} >
                        {/* <FishFromHand width={relativeToScreen(30)} height={relativeToScreen(20)} key={index} /> */}
                        {selectedFish && selectedFish.getCardComponent(60)}
                          
                      {/* <p key={index}>: {queue[queue.length - 1 - index].slice(1).join(", ")}</p>
                       */}
                       {cost.map((costItem, costIndex) => {
                        // render greyed out if there are less selected than cost
                        const numSelected = selections.filter(sel => sel.type === costItem).length;
                        const numCost = cost.filter(c => c === costItem).length;
                        const numIndex = cost.slice(0, costIndex).filter(c => c === costItem).length;
                        const isAffordable = numSelected >= numIndex + 1;
                        const opacityStyle = isAffordable ? 1.0 : 0.3;
                        return <div style={{
                          opacity: opacityStyle, marginRight: relativeToScreen(5)
                        }}>
                        {
                        (() => {
                          switch(costItem) {
                          case "young":
                            return <YoungFish width={relativeToScreen(20)} height={relativeToScreen(20)} key={costIndex} />
                          case "egg":
                            return <Egg width={relativeToScreen(20)} height={relativeToScreen(20)} key={costIndex} />
                          case "school":
                            return <SchoolFish width={relativeToScreen(20)} height={relativeToScreen(20)} key={costIndex} />
                          case "card":
                            return <DrawCard width={relativeToScreen(20)} height={relativeToScreen(20)} key={costIndex} />
                          case "tuck":
                            return null;
                          default:
                            return <p key={costIndex}>{costItem}</p>
                        }})()}
                        </div>

                       })}
                       {isAffordable && <button style = {{}}
                       onClick = {
                        () => {
                          // pay cost
                          const cost = queue[queue.length - 1 - index].cost;
                          cost.forEach(costItem => {
                            const selectedindex = selections.findIndex(sel => sel.type === costItem);
                            if (selectedindex > -1) {
                              const sel = selections[selectedindex];
                              switch(costItem) {
                                case "young":
                                  young[sel.position.x][sel.position.y] -= 1;
                                  break;
                                case "egg":
                                  eggs[sel.position.x][sel.position.y] -= 1;
                                  break;
                                case "school":
                                  schools[sel.position.x][sel.position.y] = 0;
                                  break;
                                case "card":
                                case "fishfromhand":
                                  // remove card from hand
                                  const cardIndex = fishInhand.findIndex(card => card === sel.card);
                                  console.log('Paying card cost, removing card from hand at index:', cardIndex);
                                  // add card to discarded pile
                                  discardedFish.push(fishInhand[cardIndex]);
                                  setDiscardedFish([...discardedFish]);
                                  if (cardIndex > -1) {
                                    fishInhand.splice(cardIndex, 1);
                                    setFishInHand([...fishInhand]);
                                  }
                                  break;
                                default:
                                  break;
                              }
                              // remove from selections
                              selections.splice(selectedindex, 1);
                            }
                          });
                          // remove cost from queue
                          queue.shift();
                          functions.setQueue([...queue]);
                       }}
                       >Pay Cost</button>}
                    </div>
                default:
                  return <p>{JSON.stringify(queue[queue.length - 1 - index])}</p> 
              }}
            )}
            <button
              onClick = {
                () => {
                  // pass / finish current item
                  if (queue.length > 0) {
                    queue.shift();
                    setQueue([...queue]);
                  }
                }
              }
              // only visible if something in queue, hidden if cost isnt fully paid
              style={{
                marginTop: relativeToScreen(10),
                visibility: queue.length === 0 ? 'hidden' : 
                  (Array.isArray(queue[0]) && queue[0][0] === "cost" ?
                    queue[0].slice(1).every(costItem => {
                      const numSelected = selections.filter(sel => sel.type === costItem).length;
                      const numCost = queue[0].cost.filter(c => c === costItem.type).length;
                      return numSelected >= numCost;
                    }) ? 'visible' : 'hidden'
                  : 'visible')
              }}
            >Pass/Complete</button>
          </div>

        {/* Deck */}
        <div style={{
          position: 'fixed',
          top: relativeToScreen(10),
          left: relativeToScreen(10),
          zIndex: 1000,
          // borderRadius: relativeToScreen(20),
          // border: `${relativeToScreen(2)}px solid black`,
          // borderBottomWidth: relativeToScreen(9),
          // boxShadow: `0 ${relativeToScreen(8)}px ${relativeToScreen(16)}px rgba(0, 0, 0, 0.3), 0 ${relativeToScreen(4)}px ${relativeToScreen(8)}px rgba(0, 0, 0, 0.2)`,
          boxShadow: (queue.length > 0 && (queue[0].type === 'drawcard' || queue[0].type === 'card')) 
          ? `0 0 ${relativeToScreen(5)}px ${relativeToScreen(5)}px yellow` : '2px 2px 5px rgba(0,0,0,0.3)',
          transform: 'perspective(1000px) skewY(-5deg)',
          // TODO nice skew / perspective
        }}
          onClick={
            () => {
              console.log('Draw card clicked');
              // draw card from deck to hand
              if (queue.length > 0 && queue[0].type !== 'drawcard' && queue[0].type !== 'card') {
                console.log('Not in draw card mode, cannot draw card');
                return;
              }
              if (deckFish.length > 0) {
                const drawnCard = deckFish.pop();
                queue.shift();
                fishInhand.push(drawnCard);
                setFishInHand([...fishInhand]);
                setDeckFish([...deckFish]);
                setDrawingCardAnim(true);
                setTimeout(() => {
                  setDrawingCardAnim(false);
                }, 600);
                console.log('Drew card:', drawnCard);
              }
            }
          }
        >
          {/* Stack of card effect by making array of cards with little padding */}
          {Array.from({length: Math.min(deckFish.length, 5)}, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: relativeToScreen(5 + i * 2),
                left: relativeToScreen(5 + i * 2),
                // width: relativeToScreen(100),
                // height: relativeToScreen(150),
                backgroundColor: 'white',
                borderRadius: relativeToScreen(15),
                boxShadow: `0 ${relativeToScreen(2)}px ${relativeToScreen(4)}px rgba(0, 0, 0, 0.3)`,
                border: `${relativeToScreen(1)}px solid black`,
              }}
            >
            <CardFromSheet
          id={1}
          numCardsPerRow={4}
          numRows={7}
          cardWidth={200}
          url={sheet1}
          />
              </div>
          ))}
          {/* Additional card for draw animation */}
          <div
              style={{
                position: 'absolute',
                top: drawingCardAnim ? relativeToScreen(800) : relativeToScreen(5 + 5 * 2),
                left: drawingCardAnim ? relativeToScreen(800) : relativeToScreen(5 + 5 * 2),
                // width: relativeToScreen(100),
                // height: relativeToScreen(150),
                backgroundColor: 'white',
                borderRadius: relativeToScreen(15),
                boxShadow: `0 ${relativeToScreen(2)}px ${relativeToScreen(4)}px rgba(0, 0, 0, 0.3)`,
                border: `${relativeToScreen(1)}px solid black`,
                visibility: drawingCardAnim ? 'visible' : 'hidden',
                transform: drawingCardAnim ? 'skewY(10deg) rotateY(180deg)' : 'skewY(0deg)',
                transition: drawingCardAnim ? 'all 0.5s ease-in-out' : 'none',
              }}
            >
            <CardFromSheet
            id={1}
            numCardsPerRow={4}
            numRows={7}
            cardWidth={200}
            url={sheet1}
            />
          </div>
        </div>
        {/* Hand */}
        <div 
        style={{
          position: 'fixed',
          bottom: relativeToScreen(30),
          right: relativeToScreen(30),
          display: 'inline-block',
          maxHeight: relativeToScreen(300),
          zIndex: 1000,
          overflow: 'scroll',
          scrollbarWidth: 'none',
        }}
        >
          
          {/* Fish in hand */}
          {fishInhand.map((card, i) => (
            card && 
            <div
            style = {{
              position: 'sticky',
              flexDirection: 'column',
              top: Math.min(relativeToScreen(25*i+10), 250),
              // height: relativeToScreen(150),
              // paddingTop: relativeToScreen(25*i),
              // width: relativeToScreen(200),
              marginBottom: relativeToScreen(30),
              marginTop: relativeToScreen(30),
              borderRadius: relativeToScreen(15),
              cursor: 'pointer',
              boxShadow: (selectedFish === card || selections.filter(s => s.card === card).length > 0) ? `0 0 ${relativeToScreen(2)}px ${relativeToScreen(2)}px yellow` : 'none',
              border: (selectedFish === card || selections.filter(s => s.card === card).length > 0) ? `${relativeToScreen(2)}px solid black` : 'none',
              // greyscale if cant afford
              filter: canAffordCardFromHand(card) ? "none" : "grayscale(100%)",
                
              transform: 'skewY(5deg)',
            }}
            onClick = {() => {
              // only select if in play fish mode
              if (selections.filter(s => s.card === card).length > 0) {
                // remove from selections
                const index = selections.findIndex(s => s.card === card);
                selections.splice(index, 1);
                console.log('Removed card from selections for cost:', card);
                setSelections([...selections]);
                return;
              }
              if (queue.length === 0 || queue[0].type === 'fishfromhand' ) {
                if (selectedFish === card) {
                  setSelectedFish(null);
                  console.log('Deselected card:', card);
                  return;
                }
                if (!canAffordCardFromHand(card)) {
                  console.log('Cannot afford to play card:', card);
                  return;
                }
                setSelectedFish(card);
                console.log('Selected card:', card);
              } else {
                // add as selection for costs
                if (selections.filter(s => s.card === card).length > 0) {
                  // remove from selections
                  const index = selections.findIndex(s => s.card === card);
                  selections.splice(index, 1);
                  console.log('Removed card from selections for cost:', card);
                  setSelections([...selections]);
                  return;
                }
                console.log('Adding card to selections for cost:', card);
                selections.push({type: 'card', card: card});
                setSelections([...selections]);
                console.log('Added card to selections for cost:', card);
              }
            }}
            >
            {card.getCardComponent(250,)}
            {/* <button 
              style={{
                marginTop: relativeToScreen(5),
                right: 0,
                top: 0
              }}
              onClick={() => {
                console.log('Playing card:', card);
                // remove card from hand
                const index = fishInhand.indexOf(card);
                if (index > -1) {
                  fishInhand.splice(index, 1);
                  setFishInHand([...fishInhand]);
                }
              }}
            >
              Play
            </button> */}
            </div>
          ))}
        </div>

        {/* Discard */}
        {/* Discard icon */}
        <div style={{
          position: 'fixed',
          top: relativeToScreen(-20),
          right: relativeToScreen(50),
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <Recycle width={relativeToScreen(40)} height={relativeToScreen(20)} />
          <p style = {{padding: relativeToScreen(5)}}>{discardedFish.length}</p>
        </div>
        <div 
        style={{
          position: 'fixed',
          top: relativeToScreen(30),
          right: relativeToScreen(30),
          display: 'inline-block',
          maxHeight: relativeToScreen(300),
          zIndex: 1000,
          overflow: 'scroll',
          scrollbarWidth: 'none',
          boxShadow: (queue.length > 0 && queue[0].type === 'recycle') 
          ? `0 0 ${relativeToScreen(5)}px ${relativeToScreen(5)}px yellow` : 'none',
        }}
        >
          
          {/* Fish in hand */}
          {discardedFish.map((card, i) => (
            card && 
            <div
            style = {{
              position: 'sticky',
              flexDirection: 'column',
              top: Math.min(relativeToScreen(25*i+10), 250),
              // height: relativeToScreen(150),
              // paddingTop: relativeToScreen(25*i),
              // width: relativeToScreen(200),
              marginBottom: relativeToScreen(30),
              marginTop: relativeToScreen(30),
              borderRadius: relativeToScreen(15),
              cursor: 'pointer',
              boxShadow: (selectedFish === card || selections.filter(s => s.card === card).length > 0) ? `0 0 ${relativeToScreen(2)}px ${relativeToScreen(2)}px yellow` : 'none',
              border: (selectedFish === card || selections.filter(s => s.card === card).length > 0) ? `${relativeToScreen(2)}px solid black` : 'none',
              // greyscale if cant afford
              filter: 'grayscale(100%)',
              transform: 'skewY(5deg)',
            }}
            onClick = {() => {
              // // only select if in play fish mode
              // if (queue.length === 0 || queue[0].type === 'fishfromhand' ) {
              //   if (selectedFish === card) {
              //     setSelectedFish(null);
              //     console.log('Deselected card:', card);
              //     return;
              //   }
              //   if (!canAffordCardFromHand(card)) {
              //     console.log('Cannot afford to play card:', card);
              //     return;
              //   }
              //   setSelectedFish(card);
              //   console.log('Selected card:', card);
              // } else {
              //   // add as selection for costs
              //   if (selections.filter(s => s.card === card).length > 0) {
              //     // remove from selections
              //     const index = selections.findIndex(s => s.card === card);
              //     selections.splice(index, 1);
              //     console.log('Removed card from selections for cost:', card);
              //     setSelections([...selections]);
              //     return;
              //   }
              //   console.log('Adding card to selections for cost:', card);
              //   selections.push({type: 'card', card: card});
              //   setSelections([...selections]);
              //   console.log('Added card to selections for cost:', card);
              // }


              // if queue is recycle then click to draw to hand
              if (queue.length > 0 && queue[0].type === 'recycle') {
                // remove from discarded
                const index = discardedFish.indexOf(card);
                if (index > -1) {
                  discardedFish.splice(index, 1);
                  setDiscardedFish([...discardedFish]);
                }
                // add to hand
                fishInhand.push(card);
                setFishInHand([...fishInhand]);
                // remove recycle from queue
                queue.shift();
                setQueue([...queue]);
              }
            }}
            >
            {card.getCardComponent(250,)}
            {/* <button 
              style={{
                marginTop: relativeToScreen(5),
                right: 0,
                top: 0
              }}
              onClick={() => {
                console.log('Playing card:', card);
                // remove card from hand
                const index = fishInhand.indexOf(card);
                if (index > -1) {
                  fishInhand.splice(index, 1);
                  setFishInHand([...fishInhand]);
                }
              }}
            >
              Play
            </button> */}
            </div>
          ))}
        </div>

        {/* Board */}
        <object
                data = "https://navarog.github.io/finsearch/static/media/Sun.0d0fbe355de66b5ee060.svg"
                type="image/svg+xml"
                style={{width: relativeToScreen(50), height: relativeToScreen(50)}}
              />
        {/* Dive site icons */}
        <div style={{display: 'flex', gap: relativeToScreen(10), marginBottom: relativeToScreen(10)}}>
        <div style = {{
              width: relativeToScreen(200),
              justifyContent: 'center',
              display: 'flex',
              }}
              onClick={(e) => {
                console.log('Clicked blue dive site');
                activateDiveSite(0);
              }}
              >
              <object
                  data="https://navarog.github.io/finsearch/static/media/FlipperBlue.2d3a0bf7290ca06131ac.svg"

                type="image/svg+xml"
                style={{width: relativeToScreen(30), height: relativeToScreen(30), pointerEvents: 'none'}}
              />
              </div>
              <div style = {{
              width: relativeToScreen(200),
              justifyContent: 'center',
              display: 'flex',
              }}
              onClick={(e) => {
                console.log('Clicked purple dive site');
                activateDiveSite(1);
              }}
              >
              
              <object
                  data="https://navarog.github.io/finsearch/static/media/FlipperPurple.b80b43f3b2be5b414489.svg"

                type="image/svg+xml"
                style={{width: relativeToScreen(30), height: relativeToScreen(30), pointerEvents: 'none'}}
              />
              </div>
              <div style = {{
              width: relativeToScreen(200),
              justifyContent: 'center',
              display: 'flex',
            }}
              onClick = {(e) => {
                console.log('Clicked green dive site');
                activateDiveSite(2);
              }}
            >
              <object
                data = "https://navarog.github.io/finsearch/static/media/FlipperGreen.e3397c545a5045ba2dfc.svg"
                type="image/svg+xml"
                style={{width: relativeToScreen(30), height: relativeToScreen(30), pointerEvents: 'none'}}
              />
              
              </div>
              </div>
        {fish.map((row, i) => (
          
          <>
          {
            [0,3,4].includes(i) ? <div style={{display: 'flex', gap: relativeToScreen(10), marginBottom: relativeToScreen(10)}}
          >
            {[blueZoneBonuses, purpleZoneBonuses, greenZoneBonuses].map((bonuses, index) => (
              <div style = {{
                width: relativeToScreen(200),
                justifyContent: 'flex-end',
                display: 'flex',
                // if queue[0] has source matching this then highlight
                border: (queue.length > 0 && queue[0].source === 'dive site' && queue[0].sourceCol === index &&
                  ((i == 0 && queue[0].sourceRow === 'sun zone') ||
                  (i == 3 && queue[0].sourceRow === 'mid zone') ||
                  (i == 4 && queue[0].sourceRow === 'night zone'))
                  ) ? `${relativeToScreen(2)}px solid orange` : 'none',
                // padding: relativeToScreen(5),
                // borderRadius: relativeToScreen(10),
                // grey out if no fish in zone
                // opacity: fish.some(r => r[index] !== null && 
                  // ((i == 0 && r[index].some(f => f !== null && r.indexOf(f) < 3)) || 
                  // (i == 3 && r[index].some(f => f !== null && r.indexOf(f) == 3)))) ? 1.0 : 0.3,
              }}>
                {(() => {
                  switch(bonuses[[0,3,4].indexOf(i)]) {
                    case 'card':
                      return <DrawCard width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    case 'recycle':
                      return <Recycle  width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    case 'egg':
                      return <Egg  width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    case 'hatch':
                      return <HatchFish width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    case 'move':
                      return <Move width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    default:
                      return null;
                  }
                })()}
              </div>
            ))}
          </div> : null
          }
          

          <div style={{display: 'flex', gap: relativeToScreen(10), marginBottom: relativeToScreen(10)}}
          >
            {/* 
              // TODO show column flippers only on first row
            {i === 0 ? (
              <>
                <object
                  data = "https://navarog.github.io/finsearch/static/media/FlipperBlue.2d3a0bf7290ca06131ac.svg"
                  type="image/svg+xml"
                  style={{width: relativeToScreen(50), height: relativeToScreen(50)}}
                />
                <object
                  data = "https://navarog.github.io/finsearch/static/media/FlipperBlue.2d3a0bf7290ca06131ac.svg"
                  type="image/svg+xml"
                  style={{width: relativeToScreen(50), height: relativeToScreen(50)}}
                />
                <object
                  data = "https://navarog.github.io/finsearch/static/media/FlipperBlue.2d3a0bf7290ca06131ac.svg"
                  type="image/svg+xml"
                  style={{width: relativeToScreen(50), height: relativeToScreen(50)}}
                />
              </>
            ) : null} */}
            {/* {row.map((card, j) => (
              card ? <CardFromSheet
                // key={ * 10 + j}
                id={card.idInImage}
                numCardsPerRow={4}
                numRows={7}
                cardWidth={200}
                url={card?.imageSource}
              /> 
              
              : <div
                  style={{
                    width: relativeToScreen(200),
                    height: relativeToScreen(150),
                    borderRadius: relativeToScreen(15),
                    border: `${relativeToScreen(2)}px dashed gray`,
                  }}
                  onTouchMoveCapture={() => {

                  }}
                >
                </div>
            ))} */}
            {row.map((card, j) => {
              return BoardSlot({x: i, y: j}, fish, eggs, young, schools, tuckedFish, selectedFish, deckFish, fishInhand, selections, queue, functions);
            })}

            
          </div>
          {/* Show uses of each column */}
            {
            i === 5 ? <div style={{display: 'flex', gap: relativeToScreen(10), marginBottom: relativeToScreen(10)}}
          >
            {[blueZoneBonuses, purpleZoneBonuses, greenZoneBonuses].map((bonuses, index) => (
              <div style = {{
                width: relativeToScreen(195),
                justifyContent: 'flex-end',
                display: 'flex',
                justifySelf: 'center',
                // if queue[0] has source matching this then highlight
                border: (queue.length > 0 && queue[0].source === 'dive site' && queue[0].sourceCol === index &&
                  ((i == 0 && queue[0].sourceRow === 'sun zone') ||
                  (i == 3 && queue[0].sourceRow === 'mid zone') ||
                  (i == 4 && queue[0].sourceRow === 'night zone'))
                  ) ? `${relativeToScreen(2)}px solid orange` : `${relativeToScreen(2)}px solid black`,
                
                // padding: relativeToScreen(5),
                borderRadius: relativeToScreen(10),
                paddingRight: relativeToScreen(5),
                // grey out if no fish in zone
                // opacity: fish.some(r => r[index] !== null && 
                  // ((i == 0 && r[index].some(f => f !== null && r.indexOf(f) < 3)) || 
                  // (i == 3 && r[index].some(f => f !== null && r.indexOf(f) == 3)))) ? 1.0 : 0.3,
              }}>
                {Array([uses.blueSite, uses.purpleSite, uses.greenSite][index]).fill().map((_, useIndex) => (
                  // Used diver cube
                  <div key={useIndex} style={{
                    width: relativeToScreen(15),
                    height: relativeToScreen(15),
                    borderRadius: '50%',
                    backgroundColor: 'black',
                    marginLeft: relativeToScreen(3),
                  }}></div>
                ))

                }
                {(() => {
                  switch(bonuses[3]) {
                    case 'card':
                      return <DrawCard width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    case 'recycle':
                      return <Recycle  width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    case 'egg':
                      return <Egg  width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    case 'hatch':
                      return <HatchFish width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    case 'move':
                      return <Move width={relativeToScreen(20)} height={relativeToScreen(20)}/>
                    default:
                      return null;
                  }
                })()}
              </div>
            ))}
          </div> : null
          }
          </>
          //
        ))}
        {/* Fish in hand counter */}
        <div style ={{
          position: 'fixed',
          bottom: relativeToScreen(300),
          right: relativeToScreen(30),
          fontSize: relativeToScreen(20),
          zIndex: 1000,
        }}>
          <object
                  data="https://navarog.github.io/finsearch/static/media/DrawCard.f8797f97d67a54536956.svg"

                type="image/svg+xml"
                style={{position: 'absolute', width: relativeToScreen(30), height: relativeToScreen(30)}}
              >
          </object>
          <p style = {{
            position: 'absolute',
            top: relativeToScreen(3),
            paddingTop: relativeToScreen(2),
            paddingLeft: relativeToScreen(5),
            margin: 0,
            fontSize: relativeToScreen(16),
          }}>
          {fishInhand.length}
          </p>
        </div>
        {/* Young counter */}
        <div style ={{
          position: 'fixed',
          bottom: relativeToScreen(350),
          right: relativeToScreen(50),
          fontSize: relativeToScreen(20),
          zIndex: 1000,
        }}

        >
          <YoungFish/>
          <p style = {{
            position: 'absolute',
            top: relativeToScreen(3),
            left: relativeToScreen(-10),
            paddingTop: relativeToScreen(2),
            margin: 0,
            fontSize: relativeToScreen(16),
          }}>
          {young.flat().reduce((a, b) => a + b, 0)}
          </p>
        </div>
        {/* School counter */}
        <div style ={{
          position: 'fixed',
          bottom: relativeToScreen(380),
          right: relativeToScreen(50),
          fontSize: relativeToScreen(20),
          zIndex: 1000,
        }}

        >
          <SchoolFish/>
          <p style = {{
            position: 'absolute',
            top: relativeToScreen(3),
            left: relativeToScreen(-10),
            paddingTop: relativeToScreen(2),
            margin: 0,
            fontSize: relativeToScreen(16),
          }}>
          {schools.flat().reduce((a, b) => a + b, 0)}
          </p>
        </div>
        {/* Egg counter */}
        <div style ={{
          position: 'fixed',
          bottom: relativeToScreen(410),
          right: relativeToScreen(50),
          fontSize: relativeToScreen(20),
          zIndex: 1000,
        }}

        >
          <Egg/>
          <p style = {{
            position: 'absolute',
            top: relativeToScreen(3),
            left: relativeToScreen(-10),
            paddingTop: relativeToScreen(2),
            margin: 0,
            fontSize: relativeToScreen(16),
          }}>
          {eggs.flat().reduce((a, b) => a + b, 0)}
          </p>
        </div>
          
        <button
          onClick={() => {
            // remove selected items
            selections.forEach(sel => {
              if (sel.type === 'egg') {
                eggs[sel.position.x][sel.position.y] -= 1;
              } else if (sel.type === 'young') {
                young[sel.position.x][sel.position.y] -= 1;
              } else if (sel.type === 'school') {
                schools[sel.position.x][sel.position.y] -= 1;
              }
            });
            setEggs([...eggs]);
            setYoung([...young]);
            setSchools([...schools]);
            setSelections([]);
          }}
          style = {{
            position: 'absolute',
            bottom: relativeToScreen(500),
            right: relativeToScreen(10),
            zIndex: 1000,
          }}
        >
          Pay Cost
        </button>


{/*         
        {Array.from({length: 10}, (_, i) => (
          <CardFromSheet
            key={i}
            id={i}
            numCardsPerRow={4}
            numRows={7}
            cardWidth={300}
            url={sheet1}
          />
        ))}
        <CardFromSheet
          id={5}
          numCardsPerRow={4}
          numRows={7}
          cardWidth={300}
          url={sheet1}
        /> */}
    </header>
    </div>
  );
}

