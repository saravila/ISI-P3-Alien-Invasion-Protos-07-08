/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colección de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se añaden como tableros independientes para que Game pueda
  ejecutar sus métodos step() y draw() periódicamente desde su método
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre sí. Aunque se añadiesen nuevos tableros para los
  misiles y para los enemigos, resulta difícil con esta arquitectura
  pensar en cómo podría por ejemplo detectarse la colisión de una nave
  enemiga con la nave del jugador, o cómo podría detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: diseñar e implementar un mecanismo que permita gestionar
  la interacción entre los elementos del juego. Para ello se diseñará
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego serán las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard será un board más, por lo que deberá ofrecer los
  métodos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos métodos.

  Este prototipo no añade funcionalidad nueva a la que ofrecía el
  prototipo 06.


  Especificación: GameBoard debe

  - mantener una colección a la que se pueden añadir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosión, etc.

  - interacción con Game: cuando Game llame a los métodos step() y
    draw() de un GameBoard que haya sido añadido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los métodos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisión entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deberán
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cuándo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qué tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto sólo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/

describe("Clase GameBoard", function(){

    var canvas, ctx;

    beforeEach(function(){
      loadFixtures('index.html');

      canvas = $('#game')[0];
      expect(canvas).toExist();

      ctx = canvas.getContext('2d');
      expect(ctx).toBeDefined();
    });

    it("Method add", function(){
      miBoard = new GameBoard();
      miPlayerShip = new PlayerShip();

      expect(miBoard.add(miPlayerShip)).toBe(miPlayerShip);
      expect(miBoard.objects.length).toBe(1); 
    });

    it ("Method reset removed", function() { 
      miBoard = new GameBoard(); 

      miBoard.resetRemoved(); 
      expect(miBoard.removed.length).toBe(0);
    });

    it ("Method remove", function() { 
      miBoard = new GameBoard(); 
      miPlayerShip = new PlayerShip();

      miBoard.resetRemoved();
      miBoard.remove(miPlayerShip); 
      expect(miBoard.removed.length).toBe(1);
    });

     it ("Method finalizeRemoved", function() { 
      miBoard = new GameBoard(); 
      miPlayerShip = new PlayerShip();

      miBoard.resetRemoved();
      miBoard.remove(miPlayerShip);
      miBoard.finalizeRemoved();
      expect(miBoard.objects.length).toBe(0);
    });

    it ("Method iterate", function() { 
      miBoard = new GameBoard(); 
      miPlayerShip = new PlayerShip();

      miBoard.add(miPlayerShip);
      spyOn(miPlayerShip, "step");
      miBoard.iterate("step",1.0);
      expect(miPlayerShip.step).toHaveBeenCalled();
    });  

    it ("Method collide detect y overlap", function() {       
      var misil = function () {
        this.w = SpriteSheet.map['ship'].w;
        this.h = SpriteSheet.map['ship'].h;
        this.x = Game.width/2 - this.w / 2;
        this.y = Game.height - 10 - this.h;        
      };

      miBoard = new GameBoard(); 
      miPlayerShip = new PlayerShip(); 
      miMisil = new misil();

      miBoard.add(miPlayerShip);
      miBoard.add(miMisil);
      spyOn(miBoard, "detect"); 
      spyOn(miBoard, "overlap");
      miBoard.collide(miPlayerShip); 
      expect(miBoard.detect).toHaveBeenCalled(); 
      //expect(miBoard.collide(miPlayerShip)).toEqual(miMisil);
      //expect(miBoard.overlap).toHaveBeenCalled();
      expect(miBoard.overlap(miMisil,miPlayerShip)).toBeTruthy;
    });  

    it ("Method step", function() { 
      miBoard = new GameBoard();  

      spyOn(miBoard, "resetRemoved"); 
      spyOn(miBoard, "iterate");
      spyOn(miBoard, "finalizeRemoved");
      miBoard.step(1.0);
      expect(miBoard.resetRemoved).toHaveBeenCalled();
      expect(miBoard.iterate).toHaveBeenCalled();
      expect(miBoard.finalizeRemoved).toHaveBeenCalled();
    });  

    it ("Method draw", function() { 
      miBoard = new GameBoard();  
      ctx = canvas.getContext('2d');

      spyOn(miBoard, "iterate"); 
      miBoard.draw(ctx);
      expect(miBoard.iterate).toHaveBeenCalled();
    });  

});  