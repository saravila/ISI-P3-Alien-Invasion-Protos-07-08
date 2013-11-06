/*


En el anterior prototipo, el objeto Game permite gestionar una pila de
tableros (boards). Los tres campos de estrellas, la pantalla de inicio
y el sprite de la nave del jugador se a�aden como tableros
independientes para que Game pueda ejecutar sus m�todos step() y
draw() peri�dicamente desde su m�todo loop(). Sin embargo los tableros
no pueden interaccionar entre s�. Resulta dif�cil con esta 
arquitectura pensar en c�mo podr�a por ejemplo detectarse la colisi�n
de una nave enemiga con la nave del jugador, o c�mo podr�a detectarse
si un disparo de colisiona con una nave.

Este es precisamente el requisito que se ha identificado para este
prototipo: gestionar la interacci�n entre los elementos del
juego. Piensa en esta clase como un tablero de juegos de mesa, sobre
el que se disponen los elementos del juego (fichas, cartas, etc.). En
este caso ser�n naves enemigas, nave del jugador y disparos los
elementos del juego. Para Game, GameBoard ser� un tablero m�s, por lo
que deber� ofrecer los m�todos step() y draw(), y ser� responsable de
mostrar todos los objetos que contenga cuando Game llame a estos
m�todos.



Especificaci�n: GameBoard debe

- mantener una colecci�n de objetos a la que se pueden a�adir y de la
  que se pueden eliminar sprites

- interacci�n con Game: cuando reciba los m�todos step() y draw() debe
  ocuparse de que se ejecuten estos m�todos en todos los objetos que
  contenga.

- debe detectar la colisi�n entre objetos. Querremos que los disparos
  de la nave del jugador detecten cu�ndo colisionan con una nave
  enemiga, que una nave enemiga detecte si colisiona con la nave del
  jugador, que un disparo de la nave enemiga detecte si colisiona con
  la nave del jugador,... necesitamos saber de qu� tipo es cada objeto.


*/

describe("Clase GameBoard", function(){

    var canvas, ctx;

    beforeEach(function(){
		loadFixtures('index.html');

		canvas = $('#game')[0];
		expect(canvas).toExist();

		ctx = canvas.getContext('2d');
		expect(ctx).toBeDefined();

		miBoard = new GameBoard();
		miPlayerShip = new PlayerShip();
		miPlayerShip2 = new PlayerShip();
    });

    it("Method add", function(){
		_([miPlayerShip,miPlayerShip2]).each(function(obj) { 
			expect(miBoard.add(obj)).toBe(obj);
		});    
		expect(miBoard.objects[1]).toBe(miPlayerShip2);
		expect(miBoard.objects.length).toBe(2); 
    });

    it ("Method reset removed", function() {  
		miBoard.resetRemoved(); 
		expect(miBoard.removed.length).toBe(0);
    });

    it ("Method remove", function() {  
		miBoard.resetRemoved();  
		_([miPlayerShip,miPlayerShip2]).each(function(obj) { 
			miBoard.remove(obj);
		});   
		expect(miBoard.removed.length).toBe(2);
    });

     it ("Method finalizeRemoved", function() {  
		_([miPlayerShip,miPlayerShip2]).each(function(obj) { 
			miBoard.add(obj);
		});   
		miBoard.resetRemoved();
		miBoard.remove(miPlayerShip);
		miBoard.finalizeRemoved();
		expect(miBoard.objects[0]).toBe(miPlayerShip2);
		expect(_.contains(miBoard.objects, miPlayerShip)).toBeFalsy;
    });

    it ("Method iterate", function() {  
		miBoard.add(miPlayerShip);
		spyOn(miPlayerShip, "step");
		miBoard.iterate("step",1.0);
		expect(miPlayerShip.step).toHaveBeenCalledWith(1.0);
    });  

    it ("Method collide detect y overlap", function() {       
		var miMisil = function () {
			this.w = miPlayerShip.w;
			this.h = miPlayerShip.h;
			this.x = miPlayerShip.x;
			this.y = miPlayerShip.y;        
		};
		var miobj = function() {
			this.w = 3;
			this.h = 4;
			this.x = 2;
			this.y = 1;
		};

		_([miPlayerShip,miMisil,miobj]).each(function(obj) { 
			miBoard.add(obj);
		});  
		_(["detect","overlap"]).each(function(obj) { 
			spyOn(miBoard,obj).andCallThrough();
		});   
		miBoard.collide(miPlayerShip);  
		_([miBoard.detect, miBoard.overlap]).each(function(obj) { 
			expect(obj).toHaveBeenCalled(); 
		});  
		expect(miBoard.collide(miPlayerShip)).toEqual(miMisil); 
		expect(miBoard.overlap(miMisil,miPlayerShip)).toBeTruthy;
		expect(miBoard.overlap(miMisil,miobj)).toBeFalsy;
    });  

    it ("Method step", function() {  
		_(["resetRemoved", "iterate", "finalizeRemoved"]).each(function(obj) { 
			spyOn(miBoard, obj); 
		});   
		miBoard.step(1.0);
		_([miBoard.resetRemoved, miBoard.iterate, miBoard.finalizeRemoved]).each(function(obj) { 
			expect(obj).toHaveBeenCalled();
		});    
    });  

    it ("Method draw", function() {  
		spyOn(miBoard, "iterate"); 
		miBoard.draw(ctx);
		expect(miBoard.iterate).toHaveBeenCalled();
    });  

});  
