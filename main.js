/*
Sokoban JS Game
Developed By Omar Mahrous
support@wpmeal.com
08/02/2018
*/
(function() {
  var tileMap = mapsArray[Math.floor(Math.random() * mapsArray.length)];
  var block = {
    Val: "B"
  };
  var blockInGoal = { // a code for block when it hits the goal
    Val: "S"
  };
  var goal = {
    Val: "G"
  };
  var wall = {
    Val: "W"
  };
  var space = {
    Val: " "
  };
  var playerCoords = { // to save in player position values
    Row: null,
    Col: null,
    Val: "P",
    ValBeforeUpdate: space.Val
  };
  var steps = { // to save entity stepss
    StepRow: 0,
    StepCol: 0
  };
  var goalsCoords = [];
  var bigbox = document.getElementById("bigbox");
  var goalsTotal = 0;

  /** Draw new map on browser based on array maps. */
  function drawNewMap() {
    for (var i = 0; i < tileMap.mapGrid.length; i++) {
      for (var j = 0; j < tileMap.mapGrid[i].length; j++) {
        drawElement(tileMap.mapGrid[i][j], i, j);
        if (tileMap.mapGrid[i][j] == playerCoords.Val) { // save player position on map
          playerCoords.Row = i;
          playerCoords.Col = j;
        } else if (tileMap.mapGrid[i][j] == goal.Val) { // save goals positions on map
          goalsCoords.push({
            Row: i,
            Col: j
          });
        }
      }
    }
  }
  drawNewMap();

  /** Draw new element after setting its className.*/
  function drawElement(elementType, Row, Col) {
    var elem = document.createElement("div");
    elem.id = Row + "-" + Col;
    setElementClass(elem, elementType);
    bigbox.appendChild(elem);
  }

  /** Edit element className that already drawn. */
  function EditDrawnElement(elementType, position) {
    var id = position.Row + "-" + position.Col;
    var elem = document.getElementById(id);
    setElementClass(elem, elementType);
  }

  /** Set className for element according to its value on array map. */
  function setElementClass(elem, elementType) {
    if (elementType == space.Val) elem.className = Tiles.Space;
    else if (elementType == wall.Val) elem.className = Tiles.Wall;
    else if (elementType == goal.Val) elem.className = Tiles.Goal;
    else if (elementType == block.Val) elem.className = Entities.Block;
    else if (elementType == playerCoords.Val) elem.className = Entities.Character;
    else if (elementType == blockInGoal.Val) elem.className = Tiles.Score;
  }

  /** Event handler for pressed arrow keys that handle the moving of entities on map.*/
  var headingToElementVal;
  var blocksInGoalTotal;
  var winMessage = false;
  document.body.addEventListener("keydown", eventHandler = function(event) {
    event.preventDefault();
    restSteps();
    stepsCalculator(event.keyCode);
    var playerNewPosition = getEntityNewPosition();
    if (checkEntityMovability(playerNewPosition.ValBeforeUpdate) != "false") { // check if no wall facing the player
      while (headingToElementVal == block.Val || headingToElementVal == blockInGoal.Val) { //check if the next elemet facing the player is movable i.e B or B in the goal(S)
        moveEntityFacingThePlayer(event.keyCode);
      }
      if (headingToElementVal != "false") { //  check if still no wall in front of player
        resetPlayerPositionOnMap();
        playerCoords.ValBeforeUpdate = playerNewPosition.ValBeforeUpdate; // save the value of element that player will be moved to
        setPlayerPositionOnMap(playerNewPosition);
        updatePlayerCoords(playerNewPosition);
        blocksInGoalsCalculator();
        displayWinMessage();
      }
    }
  });

  /** Move entity that is located right next to player.  */
  function moveEntityFacingThePlayer(eventKeyCode) {
    stepsCalculator(eventKeyCode);
    var entityNewPosition = getEntityNewPosition();
    if (checkEntityMovability(entityNewPosition.ValBeforeUpdate) != "false") { // if no wall against the entity
      setBlockPositionOnMap(entityNewPosition);
    }
  }

  /** Check if the element type is not a wall.  */
  function checkEntityMovability(elementType) {
    headingToElementVal = (elementType == wall.Val) ? "false" : elementType;
    return headingToElementVal;
  }

  /** Set new coords for player on map. */
  function setPlayerPositionOnMap(playerNewPosition) {
    tileMap.mapGrid[playerNewPosition.Row][playerNewPosition.Col] = playerCoords.Val;
    EditDrawnElement(playerCoords.Val, playerNewPosition);
  }

  /** Set new coords for block on map and redraw it. */
  function setBlockPositionOnMap(blockNewPosition) {
    var blockHeadingToElemVal = tileMap.mapGrid[blockNewPosition.Row][blockNewPosition.Col];
    if (blockHeadingToElemVal == goal.Val || blockHeadingToElemVal == blockInGoal.Val) { // check if element that block is heading to, is a goal or block in the goal
      tileMap.mapGrid[blockNewPosition.Row][blockNewPosition.Col] = blockInGoal.Val;
      EditDrawnElement(blockInGoal.Val, blockNewPosition);
    } else {
      tileMap.mapGrid[blockNewPosition.Row][blockNewPosition.Col] = block.Val;
      EditDrawnElement(block.Val, blockNewPosition);
    }
  }
  /** Calculate blocks in goals. */
  function blocksInGoalsCalculator() {
    blocksInGoalTotal = 0;
    for (var i = 0; i < goalsCoords.length; i++) {
      if (tileMap.mapGrid[goalsCoords[i].Row][goalsCoords[i].Col] == blockInGoal.Val) {
        blocksInGoalTotal++;
      }
    }
  }

  /** display a win message if all goals have been scored */
  function displayWinMessage() {
    if (blocksInGoalTotal == goalsCoords.length) {
      if (!winMessage) {
        alert("Congrts, u win !");
        winMessage = true;
      }
    }
  }

  /** Reset player coords on map and redraw it. */
  function resetPlayerPositionOnMap() {
    if (playerCoords.ValBeforeUpdate == goal.Val || playerCoords.ValBeforeUpdate == blockInGoal.Val) { // check if element that player is located at, is a goal or block in the goal
      tileMap.mapGrid[playerCoords.Row][playerCoords.Col] = goal.Val;
      EditDrawnElement(goal.Val, playerCoords);
    } else {
      tileMap.mapGrid[playerCoords.Row][playerCoords.Col] = space.Val;
      EditDrawnElement(space.Val, playerCoords);
    }
  }

  /** Update player coords with new position values. */
  function updatePlayerCoords(playerNewPosition) {
    playerCoords.Row = playerNewPosition.Row;
    playerCoords.Col = playerNewPosition.Col;
  }

  /** Return new position values.  */
  function getEntityNewPosition() {
    return {
      ValBeforeUpdate: tileMap.mapGrid[playerCoords.Row + steps.StepRow][playerCoords.Col + steps.StepCol],
      Row: playerCoords.Row + steps.StepRow,
      Col: playerCoords.Col + steps.StepCol
    };
  }

  /** Reset player steps.  */
  function restSteps() {
    steps.StepRow = 0;
    steps.StepCol = 0;
  }

  /** Calculate player steps based on arrow keys pressed.  */
  function stepsCalculator(eventKeyCode) {
    switch (eventKeyCode) {
      case 37:
        steps.StepCol--;
        break;
      case 38:
        steps.StepRow--;
        break;
      case 39:
        steps.StepCol++;
        break;
      case 40:
        steps.StepRow++;
        break;
    }

  }
})();
