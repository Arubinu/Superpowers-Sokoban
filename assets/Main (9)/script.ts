function onClick( camera, actor )
{
  if ( !Sup.Input.wasMouseButtonJustPressed( 0 ) && !Sup.Input.wasTouchStarted( 0 ) )
    return ( [] );

  let pos = Sup.Input.getMousePosition();
  if ( Sup.Input.wasTouchStarted( 0 ) )
    pos = Sup.Input.getTouchPosition( 0 );

  return ( rayIntersect( camera, actor, pos ) );
}

function rayIntersect( camera, actor, position: Sup.Math.Vector2 )
{
  let ray = new Sup.Math.Ray();
  let obj = typeof actor === 'object';

  camera = Sup.getActor( camera );
  actor = obj ? actor : Sup.getActor( actor );
  if ( !actor || !camera )
    return ( [] );

  ray.setFromCamera( camera.camera, position );

  return ( ray.intersectActors( obj ? actor : actor.getChildren() ) );
}

function fullscreen()
{
  let button = Sup.getActor( 'Fullscreen' ).spriteRenderer;
  let on = button.getAnimation() == 'fullscreen';

  if ( on )
    Sup.Input.goFullscreen();
  else
    Sup.Input.exitFullscreen();

  button.setAnimation( on ? 'window' : 'fullscreen' );
}

class MainBehavior extends Sup.Behavior
{
  mode = 0;

  awake()
  {
    let game = Sup.getActor( 'Game' );
    let main = Sup.getActor( 'Main' );

    let map = game.getChild( 'Current' ).tileMapRenderer;
    let preview = main.getChild( 'Preview' ).getChild( 'Map' ).tileMapRenderer;

    Game.init( game, map, main, preview );
  }

  update()
  {
    let start = Game.change;
    Game.change = false;

    if ( Sup.Input.wasMouseButtonJustPressed( 0 ) )
    {
      let hits = onClick( 'Camera', 'Title' );
      for ( let hit of hits )
      {
        if ( hit.actor.getName() == 'Fullscreen' )
        {
          fullscreen();
          break ;
        }
        else if ( hit.actor.getName() == 'Return' )
        {
          Game.setMode( 0 );
          break ;
        }
      }
    }
    //else if ( Sup.Input.wasGamepadButtonJustPressed( 0, 3 ) )
    //  fullscreen();

    switch ( Game.getMode() )
    {
      case 1: Game.setMode( 2 ); Game.Level.set( 1 ); Game.behavior( start ); break ;
      case 2: Game.behavior( false ); break ;
      case 3: Game.setMode( 2 ); Game.behavior( true ); break ;
      case 4: Game.Main.code( start ); break ;
      case 6: Game.over(); break ;
      case 5: Sup.exit(); break ;
      default: Game.Main.behavior( start );
    }
  }
}

Sup.registerBehavior( MainBehavior );