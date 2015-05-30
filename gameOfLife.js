$(function() {
  const SCREEN_SIZE = 1500;//display size
  const SIDE_CELLS = 200;//square side length
  const CELL_SIZE = SCREEN_SIZE / SIDE_CELLS;//cell square side length
  const FPS = 10;//life cycle speed

  /*life status*/
  const LIVE = 1;
  const DIE = 0;
  var canvas = document.getElementById('world');

  /*main 2dArray*/
  var field;//retain current turn's status
  var tempField;//retain last turn's status


  // window initialize
  window.onload = function() {
  //init 2dArray
  field = initialize2DArray();
  tempField = initialize2DArray();

  /*set all cells status randomly*/
  field = insertRandomValue();

  /* setting canvas param */
  canvas = document.getElementById('world');
  canvas.width = canvas.height = SCREEN_SIZE;
  var scaleRate = Math.min(window.innerWidth/SCREEN_SIZE, window.innerHeight/SCREEN_SIZE);

  canvas.style.width = canvas.style.height = SCREEN_SIZE*scaleRate+'px';  // expand canpus
  context = canvas.getContext('2d'); // context
  context.fillStyle = 'rgb(211, 85, 149)' // live cells color

  /*start game roop*/
  update();

  }

  function update() {

    //insert last turn's status to tempField
    duplicate2Darray(tempField, field);

    //set next turn's status
    setNextStatus()
    
    //display next status
    draw(field);

    //wait and move to next turn
    setTimeout(update, 1000/FPS);
  }

  /*array deep copy*/
  function duplicate2Darray(tempField, field) {

     for(var row = 0; row < tempField.length; row++) {
      for(var column = 0; column < tempField[0].length; column++) {
        tempField[row][column] = field[row][column];
      }
    }
  }

  /*draw canvas*/
  function draw(field) {
    //set all cells to black
    context.clearRect(0, 0, SCREEN_SIZE, SCREEN_SIZE); 

    /*display each cell*/
    for(var row = 0; row < field.length; row++){
      for(var column = 0; column < field.length; column++){
        var x = row * CELL_SIZE;
        var y = column * CELL_SIZE;

        /*turn live cells to pink*/
        if (field[row][column] == LIVE) {
          context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }

  /*set next field status*/
  function setNextStatus(){
    for(var row = 0; row < tempField.length; row++) {
      for(var column = 0; column < tempField[0].length; column++) {
        field[row][column] = decideNextStatus(row, column);
      }
    }
  }

  function initialize2DArray() {
    /*generate 2d array*/
    var field = new Array(SIDE_CELLS);
    for(var i = 0; i < SIDE_CELLS; i++) {
      field[i] = new Array(SIDE_CELLS);
    }

    /*insert 0 to all array elements*/
    for(var row = 0; row < field.length; row++) {
      for(var column = 0; column < field.length; column++) {
        field[row][column] = 0;
      }
    }

    return field;
  }

  /*insert 1(live) or 0(die) randomly to all array elements*/
  function insertRandomValue() {
    var array = initialize2DArray();

    for(var i = 0; i < array.length; i++){
      for(var j = 0; j < array.length; j++){
        array[i][j] =　Math.floor(Math.random()*2);
      }
    }
    return array;
  }


  /*decide live or die next tern accoding to life game rule*/
  function decideNextStatus(row, column) {
    var nextStatus = DIE;
    var currentStatus = tempField[row][column];
    var liveCells = countLiveCells(row,column);

    /**
    *game rule
    *Any live cell with fewer than two live neighbours dies, as if caused by under-population.
    *Any live cell with two or three live neighbours lives on to the next generation.
    *Any live cell with more than three live neighbours dies, as if by overcrowding.
    *Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    */
    switch (liveCells) {
      case 2:
          if(currentStatus == DIE) {
            nextStatus = DIE;
            break;
          }
          nextStatus = LIVE;
        break;
      case 3:
        nextStatus = LIVE;
        break;
      default:
        nextStatus = DIE;
        break;

    }
    return nextStatus;
  }

  /*count live cells around the coordinate*/
  function countLiveCells(row, column) {
    var liveCounter = 0;

      for(var i = row - 1; i <= row + 1;i++ ){
        for(var j = column - 1; j <= column + 1; j++) {
          /*if pointing outside of the map*/
          if(i < 0 || j < 0 ||
             SIDE_CELLS <= i || SIDE_CELLS <= j) continue;
          /*if the cell is itself*/
          if(i == row && j == column) continue;

          /*if find live cell, count up*/
          if(tempField[i][j] == LIVE) {
              liveCounter++;
          }
          }
        }
    return liveCounter;
  }

})
