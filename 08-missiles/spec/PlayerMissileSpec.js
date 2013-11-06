/*

  Requisitos: 

  La nave del usuario disparará 2 misiles si está pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendrá un tiempo de recarga de 0,25s, no pudiéndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores


  Especificación:

  - Hay que añadir a la variable sprites la especificación del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se añadirán
    misiles al tablero de juego en la posición en la que esté la nave
    del usuario. En el código de la clase PlayerSip es donde tienen
    que añadirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creación de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declararán los métodos de
    la clase en el prototipo

*/

describe("Clase PlayerMissile", function(){

  beforeEach(function(){
    loadFixtures('index.html');

    canvas = $('#game')[0];
    expect(canvas).toExist();

    ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();

    // Cargamos en la hoja de sprites el elemento que queremos testar (missile) ya que desde aquí no podemos acceder a la variable sprites.
    SpriteSheet.map = { 
      missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 }
    };
    miMisil = new PlayerMissile(3, 2000);
  });

  it ("Method step", function() {
    miMisil.board = {
      remove: function(obj) {}
    }; 
    // Quiero que y sea menor que -h y sabemos que la nueva y es la suma de la anterior más la velocidad por la fracción de
    // tiempo dt. Despejamos la dt para que la función remove sea llamada.
    dt = -(miMisil.h + miMisil.y + 1) / miMisil.vy;

    spyOn(miMisil.board, "remove").andCallThrough();
    miMisil.step(dt);
    expect(miMisil.board.remove).toHaveBeenCalledWith(miMisil); 
  });   

});

