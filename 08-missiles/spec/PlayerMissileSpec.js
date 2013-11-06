/*

  Requisitos: 

  La nave del usuario disparar� 2 misiles si est� pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendr� un tiempo de recarga de 0,25s, no pudi�ndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores


  Especificaci�n:

  - Hay que a�adir a la variable sprites la especificaci�n del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se a�adir�n
    misiles al tablero de juego en la posici�n en la que est� la nave
    del usuario. En el c�digo de la clase PlayerSip es donde tienen
    que a�adirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creaci�n de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declarar�n los m�todos de
    la clase en el prototipo

*/

describe("Clase PlayerMissile", function(){

  beforeEach(function(){
    loadFixtures('index.html');

    canvas = $('#game')[0];
    expect(canvas).toExist();

    ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();

    // Cargamos en la hoja de sprites el elemento que queremos testar (missile) ya que desde aqu� no podemos acceder a la variable sprites.
    SpriteSheet.map = { 
      missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }
    };
    miMisil = new PlayerMissile(3, 2000);
  });

  it ("Method step", function() {
    miMisil.board = {
      remove: function(obj) {}
    }; 
    // Quiero que y sea menor que -h y sabemos que la nueva y es la suma de la anterior m�s la velocidad por la fracci�n de
    // tiempo dt. Despejamos la dt para que la funci�n remove sea llamada.
    dt = -(miMisil.h + miMisil.y + 1) / miMisil.vy;

    spyOn(miMisil.board, "remove").andCallThrough();
    miMisil.step(dt);
    expect(miMisil.board.remove).toHaveBeenCalledWith(miMisil); 
  });   

});

